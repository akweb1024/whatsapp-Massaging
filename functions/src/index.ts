import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp();

const db = admin.firestore();

export const sendMessage = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'The function must be called while authenticated.'
    );
  }

  const { companyId, to, text } = data;

  const companyDoc = await db.collection('companies').doc(companyId).get();
  const companyData = companyDoc.data();

  if (!companyData) {
    throw new functions.https.HttpsError('not-found', 'Company not found.');
  }

  const { whatsappAccessToken, whatsappPhoneNumberId } = companyData;

  if (!whatsappAccessToken || !whatsappPhoneNumberId) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'WhatsApp API credentials are not configured for this company.'
    );
  }

  try {
    await axios.post(
      `https://graph.facebook.com/v15.0/${whatsappPhoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        text: { body: text },
      },
      {
        headers: {
          'Authorization': `Bearer ${whatsappAccessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return { success: true };
  } catch (error) {
    console.error('Error sending message:', error);
    throw new functions.https.HttpsError('internal', 'Error sending message.');
  }
});

export const whatsappWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method === 'GET') {
    const VERIFY_TOKEN = 'YOUR_VERIFY_TOKEN'; // Replace with your verify token
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else if (req.method === 'POST') {
    const { body } = req;

    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0] &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const from = body.entry[0].changes[0].value.messages[0].from;
        const text = body.entry[0].changes[0].value.messages[0].text.body;
        const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;

        // Find the company associated with this phone number ID
        const companiesRef = db.collection('companies');
        const snapshot = await companiesRef.where('whatsappPhoneNumberId', '==', phoneNumberId).get();

        if (!snapshot.empty) {
          const companyDoc = snapshot.docs[0];
          // Store the message in a 'messages' subcollection within the company
          await companyDoc.ref.collection('messages').add({
            from,
            text,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            direction: 'inbound',
          });
        }
      }
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});


export const inviteUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { email, name, role, companyId } = data;

  // Basic validation
  if (!(typeof email === 'string' && email.length > 0)) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid email.');
  }
  if (!(typeof name === 'string' && name.length > 0)) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid name.');
  }
  if (!['agent', 'company_admin'].includes(role)) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid role.');
  }
  if (!(typeof companyId === 'string' && companyId.length > 0)) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a valid companyId.');
  }

  // Check if the calling user has the 'company_admin' role
  const callerUid = context.auth.uid;
  const callerUserRecord = await admin.firestore().collection('users').doc(callerUid).get();
  if (callerUserRecord.data()?.role !== 'company_admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only company admins can invite new users.');
  }

  try {
    const userRecord = await admin.auth().createUser({ email });

    await admin.firestore().collection('users').doc(userRecord.uid).set({
      email,
      role,
      companyId,
      status: 'active',
      profile: {
        name,
      },
    });

    const link = await admin.auth().generatePasswordResetLink(email);
    // Implement email sending logic here (e.g., using SendGrid, Nodemailer)
    // For now, we'll just log the link
    console.log(`Password reset link for ${email}: ${link}`);

    return { result: `Successfully invited ${email}.` };
  } catch (error) {
    throw new functions.https.HttpsError('internal', 'Error creating user:', error);
  }
});
