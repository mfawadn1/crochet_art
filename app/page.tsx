import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { Star } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}>
          <div className="container">
            <h1 className={styles.heroTitle}>Corchet Art</h1>
            <p className={styles.heroSubtitle}>
              Handcrafted with love. Custom crochet creations tailored just for you.
            </p>
            <Link href="/order" className={styles.heroCta}>
              Start a Custom Order
            </Link>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className={styles.introSection}>
        <div className="container text-center">
          <h2 className={styles.sectionTitle}>Welcome to Corchet Art</h2>
          <p className={styles.introText}>
            Every piece is uniquely crafted to bring your ideas to life. Whether you're looking for a cozy blanket, a stylish tote bag, or an adorable amigurumi toy, we put our heart into every stitch. All our items are made to order and delivered safely across Pakistan.
          </p>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className={styles.galleryPreviewSection}>
        <div className="container">
          <h2 className={`${styles.sectionTitle} text-center`}>Featured Work</h2>
          <div className={styles.galleryGrid}>
            <div className={styles.galleryItem}>
              <Image 
                src="/amigurumi_bunny.jpg" 
                alt="Amigurumi Bunny" 
                fill 
                className={styles.galleryImage} 
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className={styles.imageOverlay}>Amigurumi</div>
            </div>
            <div className={styles.galleryItem}>
              <Image 
                src="/crochet_tote_bag.jpg" 
                alt="Crochet Tote Bag" 
                fill 
                className={styles.galleryImage} 
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className={styles.imageOverlay}>Bags</div>
            </div>
            <div className={styles.galleryItem}>
              <Image 
                src="/crochet_blanket.jpg" 
                alt="Crochet Blanket" 
                fill 
                className={styles.galleryImage} 
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className={styles.imageOverlay}>Blankets</div>
            </div>
          </div>
          <div className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link href="/gallery" className={styles.secondaryButton}>
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className={styles.reviewsSection}>
        <div className="container">
          <h2 className={`${styles.sectionTitle} text-center`}>Happy Customers</h2>
          <div className={styles.reviewsGrid}>
            {[
              { name: 'Sarah K.', text: 'Absolutely love my custom tote bag! The quality is amazing and the colors are perfect.' },
              { name: 'Aliya M.', text: 'The amigurumi bunny I ordered for my niece is adorable. So well-made!' },
              { name: 'Zainab T.', text: 'The warmest, coziest blanket ever. Corchet Art understood exactly what I wanted.' }
            ].map((review, i) => (
              <div key={i} className={styles.reviewCard}>
                <div className={styles.stars}>
                  <Star fill="var(--primary)" color="var(--primary)" size={20} />
                  <Star fill="var(--primary)" color="var(--primary)" size={20} />
                  <Star fill="var(--primary)" color="var(--primary)" size={20} />
                  <Star fill="var(--primary)" color="var(--primary)" size={20} />
                  <Star fill="var(--primary)" color="var(--primary)" size={20} />
                </div>
                <p className={styles.reviewText}>"{review.text}"</p>
                <p className={styles.reviewName}>- {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
