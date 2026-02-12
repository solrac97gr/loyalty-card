import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 });
    }

    const { qrCode, coffeeCount = 1 } = await request.json();

    if (!qrCode) {
      return NextResponse.json({ error: 'QR code is required' }, { status: 400 });
    }

    const cardRef = adminDb.collection('loyaltyCards').doc(qrCode);
    const cardDoc = await cardRef.get();

    if (!cardDoc.exists) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const cardData = cardDoc.data();
    const pointsPerCoffee = 10;
    const newCoffeeCount = (cardData?.coffeeCount || 0) + coffeeCount;
    const newPoints = (cardData?.points || 0) + (coffeeCount * pointsPerCoffee);

    await cardRef.update({
      coffeeCount: newCoffeeCount,
      points: newPoints,
      updatedAt: new Date(),
    });

    // Record transaction
    await adminDb.collection('transactions').add({
      userId: cardData?.userId,
      cardId: qrCode,
      coffeeCount,
      pointsAdded: coffeeCount * pointsPerCoffee,
      timestamp: new Date(),
      adminId: 'system',
    });

    return NextResponse.json({
      success: true,
      coffeeCount: newCoffeeCount,
      points: newPoints,
      message: `Added ${coffeeCount} coffee(s) and ${coffeeCount * pointsPerCoffee} points`,
    });
  } catch (error) {
    console.error('Error scanning card:', error);
    return NextResponse.json({ error: 'Failed to scan card' }, { status: 500 });
  }
}
