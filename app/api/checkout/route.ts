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

    // Generate Sequential Order ID safely
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD

    let orderCreated = false;
    let attempts = 0;
    let finalOrderId = '';

    while (!orderCreated && attempts < 5) {
      try {
        const todaysOrdersCount = await prisma.order.count({
          where: {
            dateSubmitted: {
              gte: startOfDay,
              lte: endOfDay
            }
          }
        });
        
        const sequence = (todaysOrdersCount + 1 + attempts).toString().padStart(3, '0');
        finalOrderId = `CA-${dateStr}-${sequence}`;

        const orderData: any = {
          id: finalOrderId,
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

        await prisma.order.create({
          data: orderData
        });
        
        orderCreated = true;
      } catch (err: any) {
        if (err.code === 'P2002') {
          // Unique constraint failed, someone else grabbed this ID. Retry.
          attempts++;
        } else {
          throw err;
        }
      }
    }

    if (!orderCreated) throw new Error("Failed to generate unique Order ID after 5 attempts");

    return NextResponse.json({ success: true, orderId: finalOrderId });
  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
