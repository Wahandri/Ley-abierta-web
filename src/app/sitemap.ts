import type { MetadataRoute } from 'next';
import { getAllDocs } from '@/lib/documents';

const BASE_URL = 'https://letabierta.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const docs = await getAllDocs();

    const staticRoutes: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${BASE_URL}/docs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${BASE_URL}/como-funciona`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ];

    const docRoutes: MetadataRoute.Sitemap = docs.map(doc => ({
        url: `${BASE_URL}/docs/${doc.id}`,
        lastModified: doc.updated_at || doc.date_published,
        changeFrequency: 'monthly' as const,
        priority: (doc.impact_index?.score ?? 0) >= 70 ? 0.8 : 0.6,
    }));

    return [...staticRoutes, ...docRoutes];
}
