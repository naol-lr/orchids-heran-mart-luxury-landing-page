import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';

export async function POST(req: Request) {
  try {
    const { productId, review } = await req.json();

    if (!productId || !review) {
      return NextResponse.json({ error: 'Missing productId or review data' }, { status: 400 });
    }

    const productRef = adminDb.collection('products').doc(productId);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const productData = productDoc.data();
    const existingReviews = productData?.reviews || [];
    
    // Add the new review
    const updatedReviews = [...existingReviews, review];

    await productRef.update({
      reviews: updatedReviews
    });

    return NextResponse.json({ success: true, reviews: updatedReviews });
  } catch (error: any) {
    console.error('Error adding review:', error);
    return NextResponse.json({ error: error.message || 'Failed to add review' }, { status: 500 });
  }
}
