import styles from './track.module.css';
import { prisma } from '@/lib/prisma';
import { Search } from 'lucide-react';

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const orderId = resolvedSearchParams.id;
  
  let orderData = null;
  let searchError = false;

  if (orderId) {
    try {
      const order = await prisma.order.findUnique({
        where: { id: orderId }
      });
      
      if (order) {
        orderData = {
          id: order.id,
          type: order.projectType,
          status: order.status,
          date: order.dateSubmitted.toISOString().split('T')[0]
        };
      }
    } catch (error) {
      console.error("Error looking up order:", error);
      searchError = true;
    }
  }

  return (
    <div className={styles.trackContainer}>
      <div className="container">
        <h1 className={styles.title}>Track Your Order</h1>
        
        <div className={styles.searchCard}>
          <p className="text-center" style={{ marginBottom: '2rem' }}>
            Enter your unique Order ID below to check the current status of your custom piece.
          </p>
          
          <form className={styles.searchForm} action="/track">
            <input 
              type="text" 
              name="id" 
              placeholder="e.g. CA-1234" 
              defaultValue={orderId || ''}
              className={styles.searchInput}
              required
            />
            <button type="submit" className={styles.searchButton}>
              <Search size={20} />
              Track
            </button>
          </form>
        </div>

        {orderId && (
          <div className={styles.resultsContainer}>
            {searchError ? (
              <div className={styles.errorBox}>
                Something went wrong connecting to our system. Please try again later or contact us on WhatsApp.
              </div>
            ) : orderData ? (
              <div className={styles.statusCard}>
                <div className={styles.statusHeader}>
                  <h2>Order #{orderData.id}</h2>
                  <span className={styles.dateText}>Submitted: {orderData.date}</span>
                </div>
                
                <div className={styles.projectType}>
                  Project: <strong>{orderData.type}</strong>
                </div>
                
                <div className={styles.statusDisplay}>
                  <div className={styles.statusLabel}>Current Status</div>
                  <div className={styles.statusBadge}>{orderData.status}</div>
                </div>
                
                {/* Status Explanation */}
                <div className={styles.statusExplanation}>
                  {orderData.status === 'Pending' && <p>We've received your request! Please contact us on WhatsApp to finalize details and payment.</p>}
                  {orderData.status === 'Confirmed' && <p>Your order is confirmed and in our queue! We will start working on it soon.</p>}
                  {orderData.status === 'In Progress' && <p>We are currently crafting your custom piece. It's coming to life!</p>}
                  {orderData.status === 'Ready' && <p>Your item is finished! We are preparing it for delivery/pickup.</p>}
                  {orderData.status === 'Delivered' && <p>Your order has been completed and delivered. Enjoy!</p>}
                  {orderData.status === 'Cancelled' && <p>This order has been cancelled.</p>}
                </div>
              </div>
            ) : (
              <div className={styles.notFoundBox}>
                <h3>Order Not Found</h3>
                <p>We couldn't find an order with the ID <strong>{orderId}</strong>.</p>
                <p>Please check the ID and try again, or contact us on WhatsApp if you need help.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
