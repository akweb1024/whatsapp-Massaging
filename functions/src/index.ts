import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

export const helloWorld = functions.https.onCall((data, context) => {
  return { message: "Hello from Firebase!" };
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
