import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { t } from '../i18n/ru';
import { progressToPercent } from '../utils/formatters';

export default function ContinueReading({ book }) {
  if (!book) return null;

  return (
    <section className="continue-reading glass-card">
      <div className="continue-reading__cover" style={{ background: `linear-gradient(160deg, ${book.accent}, #101521)` }}>
        <span>{book.format.toUpperCase()}</span>
      </div>
      <div className="continue-reading__body">
        <p className="eyebrow">{t.library.continueEyebrow}</p>
        <h2>{book.title}</h2>
        <p>{book.author}</p>
        <div className="progress-row">
          <div className="progress-bar"><span style={{ width: `${Math.max(book.progress * 100, 4)}%` }} /></div>
          <strong>{progressToPercent(book.progress)}</strong>
        </div>
      </div>
      <Link to={`/reader/${book.id}`} className="ghost-button">
        {t.library.openBook}
        <ArrowRight size={16} />
      </Link>
    </section>
  );
}
