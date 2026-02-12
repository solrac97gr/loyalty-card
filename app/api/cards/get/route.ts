import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import QRCode from 'qrcode';

export async function GET(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 });
    }

    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const cardsRef = adminDb.collection('loyaltyCards');
    const cardSnapshot = await cardsRef.where('email', '==', email).get();

    if (cardSnapshot.empty) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const cardDoc = cardSnapshot.docs[0];
    const cardData = cardDoc.data();
    const qrCodeImage = await QRCode.toDataURL(cardData.qrCode);

    return NextResponse.json({
      id: cardDoc.id,
      ...cardData,
      qrCodeImage,
      createdAt: cardData.createdAt.toDate(),
      updatedAt: cardData.updatedAt.toDate(),
    });
  } catch (error) {
    console.error('Error fetching card:', error);
    return NextResponse.json({ error: 'Failed to fetch card' }, { status: 500 });
  }
}
