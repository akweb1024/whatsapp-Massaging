"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.inviteUser = exports.helloWorld = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
exports.helloWorld = functions.https.onCall((data, context) => {
    return { message: "Hello from Firebase!" };
});
exports.inviteUser = functions.https.onCall(async (data, context) => {
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
    }
    catch (error) {
        throw new functions.https.HttpsError('internal', 'Error creating user:', error);
    }
});
//# sourceMappingURL=index.js.map