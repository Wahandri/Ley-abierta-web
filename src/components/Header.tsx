'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const pathname = usePathname();
    const isHome = pathname === '/';
    const isDocs = pathname === '/docs';
    const isComoFunciona = pathname === '/como-funciona';

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY;

                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    // Scrolling down & passed threshold -> hide
                    setIsVisible(false);
                } else {
                    // Scrolling up -> show
                    setIsVisible(true);
                }

                setLastScrollY(currentScrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);

        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);

    return (
        <header className={`${styles.header} ${!isVisible ? styles.headerHidden : ''}`}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    <img src="/logo.png" alt="Ley Abierta Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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
