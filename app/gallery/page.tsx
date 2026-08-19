'use client';
import { useState } from 'react';
import Image from 'next/image';
import styles from './gallery.module.css';
import { X } from 'lucide-react';

const galleryItems = [
  { id: 1, src: '/amigurumi_bunny.jpg', alt: 'Amigurumi Bunny', category: 'Amigurumi' },
  { id: 2, src: '/crochet_tote_bag.jpg', alt: 'Crochet Tote Bag', category: 'Bags' },
  { id: 3, src: '/crochet_blanket.jpg', alt: 'Crochet Blanket', category: 'Blankets' },
  // Add more placeholders to fill the grid
  { id: 4, src: '/amigurumi_bunny.jpg', alt: 'Amigurumi Bear', category: 'Amigurumi' },
  { id: 5, src: '/crochet_tote_bag.jpg', alt: 'Crochet Purse', category: 'Bags' },
  { id: 6, src: '/crochet_blanket.jpg', alt: 'Baby Blanket', category: 'Blankets' },
];

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className={styles.galleryContainer}>
      <div className="container">
        <h1 className={styles.title}>Our Gallery</h1>
        <p className="text-center" style={{ marginBottom: '3rem', fontSize: '1.1rem' }}>
          Explore our past creations. See something you like? Start a custom order!
        </p>

        <div className={styles.galleryGrid}>
          {galleryItems.map((item) => (
            <div 
              key={item.id} 
              className={styles.galleryItem}
              onClick={() => setSelectedImage(item.src)}
            >
              <Image 
                src={item.src}
                alt={item.alt}
                fill
                className={styles.image}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className={styles.overlay}>
                <span>{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className={styles.lightbox} onClick={() => setSelectedImage(null)}>
          <button 
            className={styles.closeButton}
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            <X size={32} />
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image 
              src={selectedImage} 
              alt="Enlarged view" 
              fill 
              className={styles.lightboxImage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
