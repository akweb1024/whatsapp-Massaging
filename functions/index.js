const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.setCustomUserClaims = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const uid = data.uid;
  const role = data.role;

  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    return { message: `Success! ${uid} has been made a ${role}.` };
  } catch (error) {
    console.error(error);
    throw new functions.https.HttpsError('internal', 'An error occurred while setting custom claims.');
  }
});
