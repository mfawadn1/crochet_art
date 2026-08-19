import Link from 'next/link';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.brandSection}>
          <h2 className={styles.logo}>Corchet Art</h2>
          <p className={styles.tagline}>Handmade with love, delivering across Pakistan.</p>
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
            <a href="#" aria-label="Instagram" className={styles.iconLink}><FaInstagram size={24} /></a>
            <a href="#" aria-label="Facebook" className={styles.iconLink}><FaFacebook size={24} /></a>
            <a href="#" aria-label="WhatsApp" className={styles.iconLink}><FaWhatsapp size={24} /></a>
          </div>
        </div>
      </div>
      
      <div className={styles.copyright}>
        <p>&copy; {new Date().getFullYear()} Corchet Art. All rights reserved.</p>
      </div>
    </footer>
  );
}
