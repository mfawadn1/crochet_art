import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Extract fields
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const city = formData.get('city') as string;
    const projectType = formData.get('projectType') as string;
    const description = formData.get('description') as string;
    const colors = formData.get('colors') as string;
    const size = formData.get('size') as string;
    const budget = formData.get('budget') as string;
    const neededBy = formData.get('neededBy') as string;
    
    const image = formData.get('image') as File;
    
    // Upload image to Cloudinary if it exists
    let imageUrl = '';
    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Upload using a Promise wrapper
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'corchet_art_orders' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url || '');
          }
        );
        uploadStream.end(buffer);
      });
    }
    
    // Generate Sequential Order ID safely
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, ''); // YYMMDD
    
    // Check if user is logged in
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;

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
        
        // e.g. 001, 002
        const sequence = (todaysOrdersCount + 1 + attempts).toString().padStart(3, '0');
        finalOrderId = `CA-${dateStr}-${sequence}`;

        // Insert into Postgres Database using Prisma
        await prisma.order.create({
          data: {
            id: finalOrderId,
            name,
            phone,
            city,
            projectType,
            description,
            colors: colors || null,
            size: size || null,
            imageUrl: imageUrl || null,
            budget: budget || null,
            neededBy: neededBy || null,
            status: 'Pending',
            paymentStatus: 'Unpaid',
            userId: userId,
          }
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
    console.error('Order submission error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process order' }, { status: 500 });
  }
}
