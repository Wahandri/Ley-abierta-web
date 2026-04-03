import styles from './DocsTable.module.css';
import { Document } from '@/lib/jsonl';
import DocCard from './DocCard';

interface DocsTableProps {
  docs: Document[];
}

export default function DocsTable({ docs }: DocsTableProps) {
  return (
    <section className={styles.cardsGrid} aria-label="Listado de documentos">
      {docs.map((doc) => (
        <DocCard key={doc.id} doc={doc} />
      ))}
    </section>
  );
}
