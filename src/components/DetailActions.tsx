'use client';

import { useState } from 'react';
import styles from '@/app/docs/[id]/page.module.css';

interface DetailActionsProps {
    urlOficial?: string;
    title: string;
}

export default function DetailActions({ urlOficial, title }: DetailActionsProps) {
    const [copied, setCopied] = useState(false);

    const handleDownload = () => {
        if (!urlOficial) return;
        window.open(urlOficial, '_blank', 'noopener,noreferrer');
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: 'Consulta este documento del BOE en Ley Abierta',
                    url: shareUrl
                });
                return;
            } catch {
                // user cancelled share dialog
            }
        }

        if (navigator.clipboard && shareUrl) {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1500);
        }
    };

    return (
        <div className={styles.actionButtons}>
            <button className={styles.btnPrimary} onClick={handleDownload} disabled={!urlOficial}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Ir al BOE oficial
            </button>
            <button className={styles.btnSecondary} onClick={handlePrint}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                    <rect x="6" y="14" width="12" height="8" />
                </svg>
                Descargar / imprimir
            </button>
            <button className={styles.btnTertiary} onClick={handleShare}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                {copied ? 'Enlace copiado' : 'Compartir documento'}
            </button>
        </div>
    );
}
