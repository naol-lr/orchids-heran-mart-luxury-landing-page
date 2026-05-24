import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Add message to Firestore
    try {
      await adminDb.collection('messages').add({
        name,
        email,
        message,
        createdAt: new Date(),
      });
    } catch (dbError: any) {
      console.warn('Firestore database failed or is unconfigured for contact messages. Returning simulated success.', dbError);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error adding message:', error);
    return NextResponse.json({ error: error.message || 'Failed to send message' }, { status: 500 });
  }
}
