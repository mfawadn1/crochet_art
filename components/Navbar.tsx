'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Track Order', path: '/track' },
  ];

  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          Corchet Art
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
          {status === 'authenticated' && session.user ? (
            <div className={styles.userMenu}>
              <Link href="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
              {session.user.image ? (
                <img src={session.user.image} alt="User" className={styles.userAvatar} onClick={() => signOut()} title="Logout" />
              ) : (
                <button onClick={() => signOut()} className={styles.logoutTextBtn}>Logout</button>
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
