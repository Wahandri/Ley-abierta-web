'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';
    const isDocs = pathname === '/docs';
    const isComoFunciona = pathname === '/como-funciona';

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                        <img src="/logo.png" alt="Ley Abierta Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                </Link>

                <button
                    className={styles.hamburger}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Menú"
                    aria-expanded={mobileMenuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
                    <Link
                        href="/"
                        className={`${styles.navLink} ${isHome ? styles.navLinkActive : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Inicio
                    </Link>
                    <Link
                        href="/docs"
                        className={`${styles.navLink} ${isDocs ? styles.navLinkActive : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Documentos
                    </Link>
                    <Link
                        href="/como-funciona"
                        className={`${styles.navLink} ${isComoFunciona ? styles.navLinkActive : ''}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Cómo funciona
                    </Link>
                </nav>
            </div>
        </header>
    );
}
