'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';

const THEME_STORAGE_KEY = 'ley-abierta-theme';
type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
  if (savedTheme) return savedTheme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const pathname = usePathname();
  const isHome = pathname === '/';
  const isDashboard = pathname === '/dashboard';
  const isGasto = pathname.startsWith('/gasto-publico') || pathname.startsWith('/contratos');
  const isComoFunciona = pathname === '/como-funciona';

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoWrapper} aria-label="Ley Abierta - Inicio">
          <Image src="/logo.png" alt="Ley Abierta" className={styles.logo} width={475} height={140} priority />
        </Link>

        <button
          className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menú"
          aria-expanded={mobileMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
          <Link href="/" className={`${styles.navLink} ${isHome ? styles.navLinkActive : ''}`} onClick={() => setMobileMenuOpen(false)}>
            Explorador
          </Link>
          <Link href="/dashboard" className={`${styles.navLink} ${isDashboard ? styles.navLinkActive : ''}`} onClick={() => setMobileMenuOpen(false)}>
            Dashboard
          </Link>
          <Link href="/gasto-publico" className={`${styles.navLink} ${isGasto ? styles.navLinkActive : ''}`} onClick={() => setMobileMenuOpen(false)}>
            Gasto Público
          </Link>
          <Link
            href="/como-funciona"
            className={`${styles.navLink} ${isComoFunciona ? styles.navLinkActive : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Sobre nosotros
          </Link>
        </nav>

        <button
          type="button"
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label="Cambiar tema"
          aria-pressed={theme === 'dark'}
        >
          <span className={styles.themeLabel}>{theme === 'dark' ? '🌙' : '☀️'}</span>
          <span className={`${styles.thumb} ${theme === 'dark' ? styles.thumbDark : ''}`} />
        </button>
      </div>
    </header>
  );
}
