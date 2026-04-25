// Firebase Admin SDK initialization (server-side only)
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App;

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!getApps().length) {
  if (projectId && clientEmail && privateKey) {
    try {
      adminApp = initializeApp({
        credential: cert({
          projectId: projectId.replace(/"/g, ''),
          clientEmail: clientEmail.replace(/"/g, ''),
          privateKey: privateKey.replace(/"/g, ''),
        }),
      });
    } catch (e) {
      console.error('Firebase Admin init error:', e);
      adminApp = initializeApp();
    }
  } else {
    console.warn('Firebase Admin SDK missing env variables. Proceeding with default config.');
    adminApp = initializeApp();
  }
} else {
  adminApp = getApps()[0];
}

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
export default adminApp;

