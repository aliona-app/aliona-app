import { ArrowLeft, BookmarkPlus, Info, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { t } from '../i18n/ru';

export default function ReaderToolbar({ title, onToggleSettings, onBookmark, onBack, bookId }) {
  return (
    <div className="reader-toolbar glass-card">
      <button type="button" className="icon-button icon-button--solid" onClick={onBack} aria-label={t.reader.backToBook}>
        <ArrowLeft size={18} />
      </button>
      <div className="reader-toolbar__title">
        <p className="eyebrow">{t.reader.nowReading}</p>
        <strong>{title}</strong>
      </div>
      <div className="reader-toolbar__actions">
        <button className="icon-button icon-button--solid" onClick={onBookmark} aria-label={t.reader.addBookmark}>
          <BookmarkPlus size={18} />
        </button>
        <Link to={`/book/${bookId}`} className="icon-button icon-button--solid" aria-label={t.reader.bookDetails}>
          <Info size={18} />
        </Link>
        <button className="icon-button icon-button--solid" onClick={onToggleSettings} aria-label={t.reader.readerSettings}>
          <Settings2 size={18} />
        </button>
      </div>
    </div>
  );
}
