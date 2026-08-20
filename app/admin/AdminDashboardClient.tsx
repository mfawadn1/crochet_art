'use client';
import { useState } from 'react';
import styles from './admin.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminDashboardClient({ initialOrders, initialProducts }: { initialOrders: any[], initialProducts?: any[] }) {
  const [activeTab, setActiveTab] = useState<'Orders' | 'Products'>('Orders');
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts || []);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [filter, setFilter] = useState('All');
  const [updating, setUpdating] = useState(false);
  
  // Product Form State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productForm, setProductForm] = useState({ title: '', price: '', category: 'Amigurumi', imageUrl: '', description: '', inStock: true });
  const [productImage, setProductImage] = useState<File | null>(null);
  
  const router = useRouter();

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    const method = editingProduct ? 'PUT' : 'POST';
    const formData = new FormData();
    formData.append('title', productForm.title);
    formData.append('price', productForm.price);
    formData.append('category', productForm.category);
    formData.append('description', productForm.description);
    formData.append('inStock', productForm.inStock.toString());
    
    if (editingProduct) {
      formData.append('id', editingProduct.id);
      formData.append('existingImageUrl', productForm.imageUrl);
    }
    
    if (productImage) {
      formData.append('image', productImage);
    }

    try {
      const res = await fetch('/api/admin/products', {
        method,
        body: formData
      });
      if (res.ok) {
        alert('Product saved!');
        setShowProductForm(false);
        setEditingProduct(null);
        router.refresh();
      } else {
        alert('Failed to save product');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    } finally {
      setUpdating(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl,
      description: product.description,
      inStock: product.inStock
    });
    setProductImage(null);
    setShowProductForm(true);
  };

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
            const updateObj: any = {};
            if (field === 'Status') updateObj.status = value;
            else if (field === 'Payment Status') updateObj.paymentStatus = value;
            else if (field === 'Admin Notes') updateObj.adminNotes = value;
            return { ...o, ...updateObj };
          }
          return o;
        });
        setOrders(updatedOrders);
        if (selectedOrder?.id === orderId) {
          const updateObj: any = {};
          if (field === 'Status') updateObj.status = value;
          else if (field === 'Payment Status') updateObj.paymentStatus = value;
          else if (field === 'Admin Notes') updateObj.adminNotes = value;
          setSelectedOrder({ ...selectedOrder, ...updateObj });
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
          <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Navigation</h3>
          <ul className={styles.filterList} style={{ marginBottom: '2rem' }}>
            <li>
              <button 
                className={`${styles.filterBtn} ${activeTab === 'Orders' ? styles.activeFilter : ''}`}
                onClick={() => setActiveTab('Orders')}
              >
                Manage Orders
              </button>
            </li>
            <li>
              <button 
                className={`${styles.filterBtn} ${activeTab === 'Products' ? styles.activeFilter : ''}`}
                onClick={() => setActiveTab('Products')}
              >
                Manage Products
              </button>
            </li>
          </ul>

          {activeTab === 'Orders' && (
            <>
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
            </>
          )}
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
      </div>

      <div className={styles.mainContent}>
        {activeTab === 'Products' ? (
          <div className={styles.tableCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', padding: '0 1rem' }}>
              <h2>Product Catalog</h2>
              <button 
                onClick={() => {
                  setEditingProduct(null);
                  setProductForm({ title: '', price: '', category: 'Amigurumi', imageUrl: '', description: '', inStock: true });
                  setProductImage(null);
                  setShowProductForm(!showProductForm);
                }}
                style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                {showProductForm ? 'Cancel' : '+ Add Product'}
              </button>
            </div>
            
            {showProductForm && (
              <form onSubmit={handleSaveProduct} style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title</label>
                    <input required type="text" value={productForm.title} onChange={e => setProductForm({...productForm, title: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Price (Rs.)</label>
                    <input required type="number" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category</label>
                    <input required type="text" value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Product Image</label>
                  {editingProduct && productForm.imageUrl && (
                    <div style={{ marginBottom: '1rem' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Current Image:</p>
                      <img src={productForm.imageUrl} alt="Current" style={{ width: '100px', borderRadius: '4px' }} />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={e => setProductImage(e.target.files?.[0] || null)} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} />
                  <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>{editingProduct ? 'Upload a new image to replace the current one.' : 'Upload product image (Required for new products)'}</p>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
                  <textarea required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }} />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
                    <input type="checkbox" checked={productForm.inStock} onChange={e => setProductForm({...productForm, inStock: e.target.checked})} />
                    In Stock
                  </label>
                </div>
                <button type="submit" disabled={updating} style={{ padding: '0.75rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {updating ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                </button>
              </form>
            )}

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={styles.emptyState}>No products found.</td>
                    </tr>
                  ) : (
                    products.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div style={{ position: 'relative', width: 40, height: 40, borderRadius: 4, overflow: 'hidden' }}>
                            <Image src={product.imageUrl} alt={product.title} fill style={{ objectFit: 'cover' }} />
                          </div>
                        </td>
                        <td><strong>{product.title}</strong></td>
                        <td>Rs. {product.price.toLocaleString()}</td>
                        <td>{product.category}</td>
                        <td>
                          <span className={`${styles.badge} ${product.inStock ? styles.badge_Ready : styles.badge_Cancelled}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className={styles.viewBtn}
                            onClick={() => handleEditProduct(product)}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : selectedOrder ? (
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
                
                <a 
                  href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.whatsappBtn}
                  style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1rem', background: '#25D366', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}
                >
                  Contact on WhatsApp
                </a>
              </div>
              
              {selectedOrder.orderType === 'Standard' ? (
                <div>
                  <h3>Order Items</h3>
                  <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
                    {selectedOrder.items && selectedOrder.items.length > 0 ? (
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {selectedOrder.items.map((item: any) => (
                          <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                            <span>{item.quantity}x {item.title}</span>
                            <strong>Rs. {item.priceAtBuy.toLocaleString()}</strong>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No items found.</p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #ddd' }}>
                      <strong>Total:</strong>
                      <strong>Rs. {selectedOrder.totalAmount?.toLocaleString() || '0'}</strong>
                    </div>
                  </div>
                  <p style={{ marginTop: '1rem' }}><strong>Needed By:</strong> {selectedOrder.neededBy}</p>
                </div>
              ) : (
                <div>
                  <h3>Project Request (Custom)</h3>
                  <p><strong>Type:</strong> {selectedOrder.projectType}</p>
                  <p><strong>Colors:</strong> {selectedOrder.colors}</p>
                  <p><strong>Size:</strong> {selectedOrder.size}</p>
                  <p><strong>Budget:</strong> {selectedOrder.budget}</p>
                  <p><strong>Needed By:</strong> {selectedOrder.neededBy}</p>
                </div>
              )}
            </div>

            {selectedOrder.orderType === 'Custom' && (
              <>
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
              </>
            )}

            <div className={styles.fullWidth} style={{ marginTop: '2rem', background: '#fff3cd', padding: '1rem', borderRadius: '8px', border: '1px solid #ffeeba' }}>
              <h3 style={{ color: '#856404', marginBottom: '0.5rem' }}>Admin Notes (Private)</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <textarea 
                  value={selectedOrder.adminNotes || ''}
                  onChange={(e) => setSelectedOrder({...selectedOrder, adminNotes: e.target.value})}
                  placeholder="Add private notes here..."
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px', fontFamily: 'inherit' }}
                />
                <button 
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'Admin Notes', selectedOrder.adminNotes)}
                  disabled={updating}
                  style={{ padding: '0 1.5rem', background: '#856404', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Save Notes
                </button>
              </div>
            </div>

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
                        <td>{order.orderType === 'Standard' ? 'Shop Order' : order.projectType}</td>
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
