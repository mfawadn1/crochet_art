import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_PASSWORD || 'default_secret');

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
}

import cloudinary from '@/lib/cloudinary';

export async function POST(req: Request) {
  if (!(await verifyAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const formData = await req.formData();
    
    let imageUrl = '';
    const image = formData.get('image') as File;
    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'crochet_art_products' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url || '');
          }
        );
        uploadStream.end(buffer);
      });
    }

    const product = await prisma.product.create({
      data: {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        imageUrl: imageUrl,
        category: (formData.get('category') as string) || 'Amigurumi',
        inStock: formData.get('inStock') === 'true',
      }
    });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await verifyAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const formData = await req.formData();
    const id = formData.get('id') as string;
    
    let imageUrl = formData.get('existingImageUrl') as string;
    const image = formData.get('image') as File;
    
    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imageUrl = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'crochet_art_products' },
          (error, result) => {
            if (error) return reject(error);
            resolve(result?.secure_url || '');
          }
        );
        uploadStream.end(buffer);
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        imageUrl: imageUrl,
        category: (formData.get('category') as string) || 'Amigurumi',
        inStock: formData.get('inStock') === 'true',
      }
    });
    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await verifyAuth())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await prisma.product.delete({
      where: { id }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
