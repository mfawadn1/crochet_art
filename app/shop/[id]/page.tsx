import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import styles from './shopDetail.module.css'
import ProductActions from './ProductActions'
import ProductReviews from '@/components/ProductReviews'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
    include: {
      reviews: {
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!product) {
    notFound()
  }

  return (
    <div className={styles.pageContainer}>
      <div className="container">
        <Link href="/shop" className={styles.backLink}>&larr; Back to Shop</Link>
        
        <div className={styles.productLayout}>
          <div className={styles.imageSection}>
            <div className={styles.mainImageWrapper}>
              <Image 
                src={product.imageUrl} 
                alt={product.title} 
                fill 
                className={styles.mainImage}
                priority
              />
            </div>
          </div>
          
          <div className={styles.infoSection}>
            <p className={styles.category}>{product.category}</p>
            <h1 className={styles.title}>{product.title}</h1>
            <p className={styles.price}>Rs. {product.price.toLocaleString()}</p>
            
            <div className={styles.description}>
              <h3>Product Details</h3>
              <p>{product.description}</p>
              <p><em>Note: Since all our items are handmade, slight variations may occur, making your piece truly unique!</em></p>
            </div>
            
            <ProductActions product={product} />
          </div>
        </div>

        <ProductReviews productId={product.id} reviews={product.reviews} />
      </div>
    </div>
  )
}
