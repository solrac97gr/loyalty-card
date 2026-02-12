import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';

export async function GET() {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 503 });
    }

    const transactionsRef = adminDb.collection('transactions');
    const snapshot = await transactionsRef.orderBy('timestamp', 'desc').limit(50).get();

    const transactions = snapshot.docs.map((doc: QueryDocumentSnapshot) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        cardId: data.cardId,
        coffeeCount: data.coffeeCount,
        pointsAdded: data.pointsAdded,
        timestamp: data.timestamp.toDate(),
      };
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
  }
}
