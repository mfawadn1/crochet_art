import Link from 'next/link';
import Image from 'next/image';
import { FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.brandSection}>
          <Image src="/logo.png" alt="Crochet Art" width={150} height={50} style={{ objectFit: 'contain' }} />
          <p className={styles.tagline} style={{ marginTop: '0.5rem' }}>Handmade with love, delivering across Pakistan.</p>
        </div>

        <div className={styles.linksSection}>
          <h3 className={styles.heading}>Quick Links</h3>
          <ul className={styles.linkList}>
            <li><Link href="/gallery">Gallery</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/track">Track Order</Link></li>
            <li><Link href="/admin/login">Admin Login</Link></li>
          </ul>
        </div>

        <div className={styles.socialSection}>
          <h3 className={styles.heading}>Connect with us</h3>
          <div className={styles.socialIcons}>
            {/* Replace '#' with actual links later */}
            <a href="https://www.instagram.com/crochet_art902" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.iconLink}><FaInstagram size={24} /></a>
            <a href="https://www.tiktok.com/@crochetart902?_r=1&_t=ZS-9915oaxjTBl" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={styles.iconLink}><FaTiktok size={24} /></a>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '') || ''}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={styles.iconLink}><FaWhatsapp size={24} /></a>
          </div>
        </div>
      </div>
      
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} Corchet Art. All rights reserved.</p>
      </div>
    </footer>
  );
}
