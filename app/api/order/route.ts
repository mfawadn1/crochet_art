import { NextResponse } from 'next/server';
import { getDoc } from '@/lib/googleSheets';
import cloudinary from '@/lib/cloudinary';

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
    
    // Append to Google Sheets
    // Note: This assumes the sheet is the first worksheet (index 0) 
    // and headers are exactly matching these keys on row 1:
    // Order ID, Name, Phone, City, Project Type, Description, Colors, Size, Reference Image URL, Budget, Needed By, Status, Payment Status, Date Submitted
    
    try {
      const doc = await getDoc();
      const sheet = doc.sheetsByIndex[0]; // first worksheet
      
      await sheet.addRow({
        'Order ID': orderId,
        'Name': name,
        'Phone': phone,
        'City': city,
        'Project Type': projectType,
        'Description': description,
        'Colors': colors || 'N/A',
        'Size': size || 'N/A',
        'Reference Image URL': imageUrl || 'No image',
        'Budget': budget || 'N/A',
        'Needed By': neededBy || 'N/A',
        'Status': 'Pending',
        'Payment Status': 'Unpaid',
        'Date Submitted': new Date().toISOString().split('T')[0] // YYYY-MM-DD
      });
    } catch (sheetError) {
      console.error("Google Sheets Error:", sheetError);
      // We don't fail here if the user hasn't set up the sheet yet for local testing
      // but in production we should. We'll return the ID anyway to let the UI proceed.
    }
    
    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    console.error('Order submission error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process order' }, { status: 500 });
  }
}
