// Firebase Admin SDK initialization (server-side only)
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App;

if (!getApps().length) {
  // Use env variables if available, otherwise initialize without credentials so static builds don't fail
  if (process.env.FIREBASE_PROJECT_ID) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    adminApp = initializeApp();
  }
} else {
  adminApp = getApps()[0];
}

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
export default adminApp;
