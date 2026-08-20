'use client';

import { useCart } from '@/components/CartContext';
import { useRouter } from 'next/navigation';
import styles from './shopDetail.module.css';
import { useState } from 'react';

export default function ProductActions({ product }: { product: any }) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  if (!product.inStock) {
    return <button className={styles.outOfStockBtn} disabled>Out of Stock</button>;
  }

  return (
    <div className={styles.actionsContainer}>
      <button 
        className={styles.addToCartBtn} 
        onClick={handleAddToCart}
        disabled={added}
      >
        {added ? 'Added to Cart!' : 'Add to Cart'}
      </button>
      <button 
        className={styles.buyNowBtn} 
        onClick={handleBuyNow}
      >
        Buy Now
      </button>
    </div>
  );
}
