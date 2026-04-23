import { BookMarked, Heart, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { t } from '../i18n/ru';
import { progressToPercent } from '../utils/formatters';

export default function BookCard({ book, compact = false }) {
  return (
    <Link to={`/book/${book.id}`} className={`book-card glass-card ${compact ? 'book-card--compact' : ''}`}>
      <div className="book-cover" style={{ background: `linear-gradient(160deg, ${book.accent}, #111723)` }}>
        <div className="book-cover__shine" />
        <span className="book-format">{book.format.toUpperCase()}</span>
        <h3>{book.title}</h3>
        <p>{book.author}</p>
      </div>
      <div className="book-card__meta">
        <div>
          <h4>{book.title}</h4>
          <p>{book.author}</p>
        </div>
        <div className="book-card__tags">
          <span><BookMarked size={14} /> {book.format.toUpperCase()}</span>
          <span><Clock3 size={14} /> {progressToPercent(book.progress)}</span>
          {book.favorite ? <span><Heart size={14} /> {t.library.filterFavorites}</span> : null}
        </div>
      </div>
    </Link>
  );
}
