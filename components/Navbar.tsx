'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, User, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useCart } from './CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { cartCount } = useCart();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Track Order', path: '/track' },
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <Image src="/logo.png" alt="Crochet Art" width={150} height={50} style={{ objectFit: 'contain' }} />
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.desktopNav}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.path}
              className={`${styles.navLink} ${pathname === link.path ? styles.active : ''}`}
            >
              {link.name}
            </Link>
          ))}
          
          <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--text-dark)' }}>
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span style={{ position: 'absolute', top: -8, right: -8, background: 'var(--primary)', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {cartCount}
              </span>
            )}
          </Link>

          {status === 'authenticated' && session.user ? (
            <div className={styles.userMenuContainer}>
              <div 
                className={styles.userAvatarContainer} 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
              >
                {session.user.image ? (
                  <img src={session.user.image} alt="User" className={styles.userAvatar} />
                ) : (
                  <div style={{width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                    {session.user.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dark)' }}>
                  {session.user.name?.split(' ')[0]}
                </span>
              </div>
              
              {dropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <Link href="/dashboard" className={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    My Dashboard
                  </Link>
                  <hr className={styles.dropdownDivider} />
                  <button onClick={() => { signOut(); setDropdownOpen(false); }} className={styles.dropdownItem}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => signIn('google')} className={styles.loginBtn}>
              Login
            </button>
          )}
          <Link href="/order" className={styles.ctaButton}>
            Custom Order
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className={styles.mobileToggle} 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className={styles.mobileNav}>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.path}
              className={styles.mobileNavLink}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {status === 'authenticated' && session.user ? (
            <>
              <Link href="/dashboard" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
              <button onClick={() => { signOut(); setIsOpen(false); }} className={styles.mobileNavLink} style={{textAlign: 'left'}}>
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => { signIn('google'); setIsOpen(false); }} className={styles.mobileNavLink} style={{textAlign: 'left'}}>
              Login
            </button>
          )}
          <Link 
            href="/order" 
            className={styles.mobileCtaButton}
            onClick={() => setIsOpen(false)}
          >
            Custom Order
          </Link>
        </nav>
      )}
    </header>
  );
}
