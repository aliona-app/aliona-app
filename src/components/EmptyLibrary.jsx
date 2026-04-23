import { FolderOpenDot } from 'lucide-react';
import { t } from '../i18n/ru';

export default function EmptyLibrary() {
  return (
    <section className="empty-state glass-card">
      <div className="empty-state__icon"><FolderOpenDot size={28} /></div>
      <h3>{t.library.emptyTitle}</h3>
      <p>{t.library.emptyCopy}</p>
    </section>
  );
}
