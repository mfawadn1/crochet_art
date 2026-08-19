import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma';
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

  // Fetch orders from Database
  let orders: any[] = [];
  try {
    const rawOrders = await prisma.order.findMany({
      orderBy: { dateSubmitted: 'desc' },
      include: {
        user: {
          select: { email: true, image: true }
        }
      }
    });
    
    // Map to client format
    orders = rawOrders.map((row) => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      city: row.city,
      projectType: row.projectType,
      description: row.description,
      colors: row.colors || 'N/A',
      size: row.size || 'N/A',
      imageUrl: row.imageUrl || 'No image',
      budget: row.budget || 'N/A',
      neededBy: row.neededBy || 'N/A',
      status: row.status,
      paymentStatus: row.paymentStatus,
      date: row.dateSubmitted.toISOString().split('T')[0],
      userEmail: row.user?.email,
      userImage: row.user?.image,
    }));
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
