'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className={styles.header}>
            <div className={`container ${styles.container}`}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoMain}>Ley Abierta</span>
                    <span className={styles.logoSub}>El Vigilante</span>
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
                    <Link href="/" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                        Inicio
                    </Link>
                    <Link href="/docs" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                        Documentos
                    </Link>
                    <Link href="/docs?view=topics" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                        Temas
                    </Link>
                </nav>
            </div>
        </header>
    );
}
