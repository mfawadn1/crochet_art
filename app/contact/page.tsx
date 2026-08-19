import styles from './contact.module.css';
import { FaWhatsapp, FaInstagram, FaTiktok } from 'react-icons/fa';
import Link from 'next/link';

export default function ContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div className={styles.contactContainer}>
      <div className="container">
        <h1 className={styles.title}>Get in Touch</h1>
        
        <div className={styles.contentGrid}>
          <div className={styles.infoCard}>
            <h2>Chat with Us on WhatsApp</h2>
            <p>
              The fastest way to reach us for custom orders, tracking updates, or general questions is via WhatsApp. We typically reply within a few hours.
            </p>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.whatsappButton}
            >
              <FaWhatsapp size={24} />
              Message on WhatsApp
            </a>
          </div>

          <div className={styles.infoCard}>
            <h2>Follow Our Journey</h2>
            <p>
              Check out our latest creations, behind-the-scenes content, and special announcements on our social media pages.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://www.instagram.com/crochet_art902" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaInstagram size={28} />
                <span>Instagram</span>
              </a>
              <a href="https://www.tiktok.com/@crochetart902?_r=1&_t=ZS-9915oaxjTBl" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaTiktok size={28} />
                <span>TikTok</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className={styles.faqSection}>
          <h2 className="text-center">Ready to Order?</h2>
          <p className="text-center">
            If you know what you want, you can skip the chat and fill out our custom order form directly. We'll receive all the details and confirm with you on WhatsApp.
          </p>
          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link href="/order" className={styles.secondaryButton}>
              Go to Order Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
