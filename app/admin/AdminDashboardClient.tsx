'use client';
import { useState } from 'react';
import styles from './admin.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminDashboardClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [filter, setFilter] = useState('All');
  const [updating, setUpdating] = useState(false);
  const router = useRouter();

  const handleUpdateStatus = async (orderId: string, field: string, value: string) => {
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, field, value }),
      });

      if (res.ok) {
        // Update local state
        const updatedOrders = orders.map(o => {
          if (o.id === orderId) {
            return { ...o, [field === 'Status' ? 'status' : 'paymentStatus']: value };
          }
          return o;
        });
        setOrders(updatedOrders);
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, [field === 'Status' ? 'status' : 'paymentStatus']: value });
        }
        alert('Updated successfully');
      } else {
        alert('Failed to update');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating');
    } finally {
      setUpdating(false);
      router.refresh();
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className={styles.dashboardLayout}>
      <div className={styles.sidebar}>
        <div className={styles.filterSection}>
          <h3>Filter by Status</h3>
          <ul className={styles.filterList}>
            {['All', 'Pending', 'Confirmed', 'In Progress', 'Ready', 'Delivered', 'Cancelled'].map(status => (
              <li key={status}>
                <button 
                  className={`${styles.filterBtn} ${filter === status ? styles.activeFilter : ''}`}
                  onClick={() => setFilter(status)}
                >
                  {status}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </div>

      <div className={styles.mainContent}>
        {selectedOrder ? (
          <div className={styles.detailCard}>
            <button className={styles.backBtn} onClick={() => setSelectedOrder(null)}>
              &larr; Back to List
            </button>
            <div className={styles.detailHeader}>
              <h2>Order {selectedOrder.id}</h2>
              <div className={styles.detailDate}>{selectedOrder.date}</div>
            </div>

            <div className={styles.grid2Col}>
              <div>
                <h3>Customer Details</h3>
                <p><strong>Name:</strong> {selectedOrder.name}</p>
                <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                <p><strong>City:</strong> {selectedOrder.city}</p>
                {selectedOrder.userEmail && <p><strong>Email (Account):</strong> {selectedOrder.userEmail}</p>}
              </div>
              <div>
                <h3>Project Request</h3>
                <p><strong>Type:</strong> {selectedOrder.projectType}</p>
                <p><strong>Colors:</strong> {selectedOrder.colors}</p>
                <p><strong>Size:</strong> {selectedOrder.size}</p>
                <p><strong>Budget:</strong> {selectedOrder.budget}</p>
                <p><strong>Needed By:</strong> {selectedOrder.neededBy}</p>
              </div>
            </div>

            <div className={styles.fullWidth}>
              <h3>Description</h3>
              <p className={styles.descriptionText}>{selectedOrder.description}</p>
            </div>

            {selectedOrder.imageUrl && selectedOrder.imageUrl !== 'No image' && (
              <div className={styles.fullWidth}>
                <h3>Reference Image</h3>
                <a href={selectedOrder.imageUrl} target="_blank" rel="noopener noreferrer">
                  <div className={styles.refImageWrapper}>
                    <Image src={selectedOrder.imageUrl} alt="Reference" fill className={styles.refImage} />
                  </div>
                </a>
              </div>
            )}

            <div className={styles.actionSection}>
              <div className={styles.actionGroup}>
                <label>Order Status:</label>
                <select 
                  value={selectedOrder.status}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, 'Status', e.target.value)}
                  disabled={updating}
                  className={styles.statusSelect}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Ready">Ready</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className={styles.actionGroup}>
                <label>Payment Status:</label>
                <select 
                  value={selectedOrder.paymentStatus}
                  onChange={(e) => handleUpdateStatus(selectedOrder.id, 'Payment Status', e.target.value)}
                  disabled={updating}
                  className={styles.paymentSelect}
                >
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.tableCard}>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className={styles.emptyState}>No orders found.</td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td><strong>{order.id}</strong></td>
                        <td>{order.date}</td>
                        <td>{order.name}</td>
                        <td>{order.projectType}</td>
                        <td>
                          <span className={`${styles.badge} ${styles[`badge_${order.status.replace(' ', '')}`]}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.badge} ${order.paymentStatus === 'Paid' ? styles.badge_Paid : styles.badge_Unpaid}`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <button 
                            className={styles.viewBtn}
                            onClick={() => setSelectedOrder(order)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
