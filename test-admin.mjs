import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    let val = match[2];
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    // We want to test exactly how next.js does it. If it replaces literal \n with newline:
    val = val.replace(/\\n/g, '\n');
    env[match[1]] = val;
  }
});

let adminApp;
if (!getApps().length) {
  adminApp = initializeApp({
    credential: cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY,
    }),
  });
} else {
  adminApp = getApps()[0];
}

const adminDb = getFirestore(adminApp);
async function run() {
  try {
    const products = await adminDb.collection('products').limit(1).get();
    if (products.empty) {
      console.log('No products found');
    } else {
      console.log('Found product ID:', products.docs[0].id);
      console.log('Admin SDK works!');
    }
  } catch (e) {
    console.error('Error:', e);
  }
}
run();
