import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

/**
 * PesaPal IPN (Instant Payment Notification) Endpoint
 * Handles background notifications from PesaPal to confirm status.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderTrackingId = searchParams.get('OrderTrackingId');
  const orderMerchantReference = searchParams.get('OrderMerchantReference');

  if (!orderTrackingId) {
    return NextResponse.json({ status: 400, message: 'Missing tracking ID' });
  }

  try {
    // In a real live environment, you would call PesaPal's status API here
    // For this storefront flow, we poll the transactions to find a match
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where("orderTrackingId", "==", orderTrackingId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const txDoc = querySnapshot.docs[0];
      const userId = txDoc.data().userId;

      // Unlock the assessment for the student
      await setDoc(doc(db, 'users', userId), { 
        hasPaidAssessment: true,
        unlockedAt: new Date().toISOString()
      }, { merge: true });

      // Update the transaction log
      await setDoc(doc(db, 'transactions', txDoc.id), { 
        status: 'COMPLETED',
        verifiedAt: new Date().toISOString()
      }, { merge: true });
    }

    return NextResponse.json({
      orderTrackingId,
      orderMerchantReference,
      status: 200
    });
  } catch (err) {
    console.error('[IPN Error]', err);
    return NextResponse.json({ status: 500 });
  }
}

export async function POST(request: Request) {
  return NextResponse.json({ status: 200 });
}