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
    
    // Generate Order ID
    const orderId = `CA-${Math.floor(1000 + Math.random() * 9000)}`; // e.g. CA-4592
    
    // Check if user is logged in
    const session = await getServerSession(authOptions);
    const userId = session?.user ? (session.user as any).id : null;
    
    // Insert into Postgres Database using Prisma
    await prisma.order.create({
      data: {
        id: orderId,
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
    
    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Order submission error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process order' }, { status: 500 });
  }
}
