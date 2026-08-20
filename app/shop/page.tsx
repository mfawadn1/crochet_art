import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import styles from './shop.module.css'

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className={styles.shopContainer}>
      <div className="container">
        <div className={styles.header}>
          <h1>Our Collection</h1>
          <p>Beautiful, hand-crafted crochet items ready for you.</p>
        </div>

        <div className={styles.grid}>
          {products.length === 0 ? (
            <div className={styles.emptyState}>
              <h2>Coming Soon!</h2>
              <p>We are currently crafting beautiful pieces to add to our shop.</p>
              <Link href="/order" className={styles.ctaButton}>Request a Custom Piece Instead</Link>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.imageWrapper}>
                  <Image src={product.imageUrl} alt={product.title} fill className={styles.productImage} />
                  {!product.inStock && <span className={styles.outOfStock}>Out of Stock</span>}
                </div>
                <div className={styles.productInfo}>
                  <p className={styles.category}>{product.category}</p>
                  <h3 className={styles.title}>{product.title}</h3>
                  <p className={styles.price}>Rs. {product.price.toLocaleString()}</p>
                  
                  <Link href={`/shop/${product.id}`} className={styles.viewButton}>
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
