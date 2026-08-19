import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { getDoc } from '@/lib/googleSheets';

const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_PASSWORD || 'default_secret');

export async function POST(request: Request) {
  try {
    // 1. Verify Auth
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    try {
      await jwtVerify(token, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Request
    const { rowIndex, field, value } = await request.json();

    if (!rowIndex || !field || !value) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    // 3. Update Google Sheets
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    
    const rows = await sheet.getRows();
    const targetRow = rows[rowIndex - 2]; // Subtract 2 because row index is 1-based and header is row 1

    if (!targetRow) {
      return NextResponse.json({ success: false, error: 'Row not found' }, { status: 404 });
    }

    targetRow.set(field, value);
    await targetRow.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
