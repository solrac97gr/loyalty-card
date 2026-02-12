import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 });
    }

    const cardsRef = adminDb.collection('loyaltyCards');
    const snapshot = await cardsRef.orderBy('updatedAt', 'desc').get();

    const cards = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        email: data.email,
        points: data.points,
        coffeeCount: data.coffeeCount,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    });

    return NextResponse.json({ cards });
  } catch (error) {
    console.error('Error fetching cards:', error);
    return NextResponse.json({ error: 'Failed to fetch cards' }, { status: 500 });
  }
}
