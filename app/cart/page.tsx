'use client';

import { useCart } from '@/components/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus } from 'lucide-react';
import styles from './cart.module.css';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    neededBy: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cartItems: cart,
          totalAmount: cartTotal
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        clearCart();
        router.push(`/track?id=${data.orderId}`);
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during checkout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className={styles.cartContainer}>
        <div className="container">
          <div className={styles.emptyCart}>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link href="/shop" className={styles.continueBtn}>Return to Shop</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className="container">
        <h1 className={styles.pageTitle}>Shopping Cart</h1>
        
        <div className={styles.cartLayout}>
          <div className={styles.cartItems}>
            <div className={styles.cartHeader}>
              <span>Product</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            
            {cart.map((item) => (
              <div key={item.id} className={styles.cartRow}>
                <div className={styles.productCol}>
                  <div className={styles.imageWrapper}>
                    <Image src={item.imageUrl} alt={item.title} fill className={styles.itemImage} />
                  </div>
                  <div>
                    <h3 className={styles.itemTitle}>{item.title}</h3>
                    <p className={styles.itemPrice}>Rs. {item.price.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className={styles.quantityCol}>
                  <div className={styles.quantityControls}>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={16} /></button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={16} /></button>
                  </div>
                  <button type="button" className={styles.removeBtn} onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
                
                <div className={styles.totalCol}>
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
          
          <div className={styles.checkoutSidebar}>
            <h2>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>Rs. {cartTotal.toLocaleString()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span>Calculated on WhatsApp</span>
            </div>
            <hr className={styles.divider} />
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Estimated Total</span>
              <span>Rs. {cartTotal.toLocaleString()}</span>
            </div>
            
            <form onSubmit={handleCheckout} className={styles.checkoutForm}>
              <h3>Delivery Details</h3>
              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Phone Number (WhatsApp) *</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>City *</label>
                <input type="text" name="city" required value={formData.city} onChange={handleChange} />
              </div>
              <div className={styles.formGroup}>
                <label>Needed By (Optional)</label>
                <input type="date" name="neededBy" value={formData.neededBy} onChange={handleChange} />
              </div>
              
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </button>
              <p className={styles.disclaimer}>
                By placing this order, you agree to our terms. We will contact you via WhatsApp to finalize payment and delivery.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
