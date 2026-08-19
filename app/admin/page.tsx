import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { getDoc } from '@/lib/googleSheets';
import AdminDashboardClient from './AdminDashboardClient';

const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_PASSWORD || 'default_secret');

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
}

export default async function AdminPage() {
  const isAuthenticated = await verifyAuth();

  if (!isAuthenticated) {
    redirect('/admin/login');
  }

  // Fetch orders from Google Sheets
  let orders: any[] = [];
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    
    // Map rows to a cleaner format and reverse so newest is first
    orders = rows.map((row, index) => ({
      rowIndex: index + 2, // +2 because header is row 1, and array is 0-indexed
      id: row.get('Order ID'),
      name: row.get('Name'),
      phone: row.get('Phone'),
      city: row.get('City'),
      projectType: row.get('Project Type'),
      description: row.get('Description'),
      colors: row.get('Colors'),
      size: row.get('Size'),
      imageUrl: row.get('Reference Image URL'),
      budget: row.get('Budget'),
      neededBy: row.get('Needed By'),
      status: row.get('Status'),
      paymentStatus: row.get('Payment Status'),
      date: row.get('Date Submitted')
    })).reverse();
  } catch (error) {
    console.error("Error fetching orders:", error);
    // Continue with empty orders if error
  }

  return (
    <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', padding: '3rem 0' }}>
      <div className="container">
        <h1 style={{ color: 'var(--primary)', marginBottom: '2rem' }}>Admin Dashboard</h1>
        
        {/* Pass data to Client Component for interactivity (filtering, updating status) */}
        <AdminDashboardClient initialOrders={orders} />
      </div>
    </div>
  );
}
