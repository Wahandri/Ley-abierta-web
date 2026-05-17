'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DocsPage() {
  const router = useRouter();
  useEffect(() => { router.replace('/'); }, [router]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
      Redirigiendo al explorador...
    </div>
  );
}
