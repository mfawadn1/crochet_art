import styles from './about.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className={styles.aboutContainer}>
      <div className="container">
        <h1 className={styles.title}>Our Story</h1>
        
        <div className={styles.contentGrid}>
          <div className={styles.imageWrapper}>
            <Image 
              src="/amigurumi_bunny.jpg" 
              alt="Handmade Amigurumi" 
              fill 
              className={styles.image}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          
          <div className={styles.textContent}>
            <h2>Handmade with Love in Pakistan</h2>
            <p>
              Welcome to Corchet Art, where every stitch tells a story. We are a small, passionate artisanal business dedicated to bringing you the highest quality custom crochet pieces.
            </p>
            <p>
              Whether you are looking for a unique amigurumi toy for a loved one, a stylish tote bag, or a warm blanket to cozy up with, we craft each item with meticulous care and the finest yarns.
            </p>
            <p>
              Unlike mass-produced items, our creations are <strong>made to order</strong>, meaning you have the freedom to customize colors, sizes, and designs to perfectly match your vision. 
            </p>
            
            <div className={styles.ctaWrapper}>
              <Link href="/order" className={styles.ctaButton}>
                Start Your Custom Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
