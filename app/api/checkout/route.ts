import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { name, phone, city, neededBy, cartItems, totalAmount } = body;

    if (!name || !phone || !city || !cartItems || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing required fields or empty cart' }, { status: 400 });
    }

    // Generate a unique ID like CA-XXXX
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const orderId = `CA-${randomId}`;

    const orderData: any = {
      id: orderId,
      name,
      phone,
      city,
      orderType: 'Standard',
      totalAmount,
      neededBy: neededBy || undefined,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      items: {
        create: cartItems.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
          priceAtBuy: item.price,
        }))
      }
    };

    // Link to logged-in user if available
    if (session && session.user) {
      const userId = (session.user as any).id;
      if (userId) {
        orderData.userId = userId;
      }
    }

    const order = await prisma.order.create({
      data: orderData
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
