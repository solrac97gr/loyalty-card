import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import QRCode from 'qrcode';
import { randomUUID } from 'crypto';

export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if card already exists for this email
    const cardsRef = adminDb.collection('loyaltyCards');
    const existingCard = await cardsRef.where('email', '==', email).get();

    if (!existingCard.empty) {
      const cardData = existingCard.docs[0].data();
      return NextResponse.json({
        id: existingCard.docs[0].id,
        ...cardData,
      });
    }

    // Create new loyalty card with cryptographically secure ID
    const cardId = `CARD-${randomUUID()}`;
    const qrCodeData = await QRCode.toDataURL(cardId);

    const newCard = {
      userId: email,
      email,
      points: 0,
      coffeeCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      qrCode: cardId,
    };

    await cardsRef.doc(cardId).set(newCard);

    return NextResponse.json({
      id: cardId,
      ...newCard,
      qrCodeImage: qrCodeData,
    });
  } catch (error) {
    console.error('Error creating card:', error);
    return NextResponse.json({ error: 'Failed to create card' }, { status: 500 });
  }
}
