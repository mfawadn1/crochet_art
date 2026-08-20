import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import styles from "./dashboard.module.css"
import Image from "next/image"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/")
  }

  const userId = (session.user as any).id;

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { dateSubmitted: 'desc' },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  return (
    <div className={styles.dashboardContainer}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.profileHeader}>
            {session.user.image ? (
              <Image src={session.user.image} alt={session.user.name || "User"} width={64} height={64} className={styles.profileImage} />
            ) : (
              <div className={styles.profilePlaceholder}>
                {session.user.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className={styles.profileInfo}>
              <h1>Welcome, {session.user.name?.split(' ')[0]}!</h1>
              <p>{session.user.email}</p>
            </div>
            <Link href="/api/auth/signout" className={styles.logoutButton}>
              Sign Out
            </Link>
          </div>
          <p className={styles.subtitle}>Here are all the custom pieces you've requested.</p>
        </div>

        {orders.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>No orders yet</h2>
            <p>You haven't placed any custom orders yet. Let's make something beautiful!</p>
            <Link href="/order" className={styles.ctaButton}>Start Custom Order</Link>
          </div>
        ) : (
          <div className={styles.ordersGrid}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <h3>Order #{order.id}</h3>
                  <span className={`${styles.badge} ${styles[`badge_${order.status.replace(' ', '')}`]}`}>
                    {order.status}
                  </span>
                </div>
                
                <p className={styles.date}>Submitted: {order.dateSubmitted.toISOString().split('T')[0]}</p>
                <p className={styles.type}><strong>Order Type:</strong> {order.orderType === 'Standard' ? 'Shop Purchase' : 'Custom Request'}</p>
                
                {order.orderType === 'Standard' ? (
                  <div className={styles.itemsList}>
                    {order.items.map((item: any) => (
                      <div key={item.id} className={styles.itemRow} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                        <span>{item.quantity}x {item.product?.title || 'Unknown Product'}</span>
                        <strong>Rs. {item.priceAtBuy.toLocaleString()}</strong>
                      </div>
                    ))}
                    <div className={styles.totalRow} style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', marginTop: '0.5rem', borderTop: '2px solid #ddd' }}>
                      <strong>Total:</strong>
                      <strong>Rs. {order.totalAmount?.toLocaleString() || '0'}</strong>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={styles.projectType}><strong>Project:</strong> {order.projectType}</p>
                    {order.imageUrl && order.imageUrl !== 'No image' && (
                      <div className={styles.imageContainer}>
                        <Image src={order.imageUrl} alt="Reference" fill className={styles.refImage} />
                      </div>
                    )}
                  </>
                )}
                
                <div className={styles.statusDescription}>
                  {order.status === 'Pending' && <p>Request received! We'll reach out on WhatsApp to finalize.</p>}
                  {order.status === 'Confirmed' && <p>Order confirmed! We'll start crafting soon.</p>}
                  {order.status === 'In Progress' && <p>We're actively working on your piece!</p>}
                  {order.status === 'Ready' && <p>Your piece is ready for delivery!</p>}
                  {order.status === 'Delivered' && <p>Completed and delivered.</p>}
                </div>
                
                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                  <a 
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                  >
                    Contact via WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
