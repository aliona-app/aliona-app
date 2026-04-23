import { ArrowLeft, Heart, Play, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { t } from '../i18n/ru';
import { bytesToReadable, formatDate, progressToPercent, readingTimeFromHtml } from '../utils/formatters';
import { deleteBook, getBook, toggleFavorite } from '../storage/db';

export default function BookDetailsPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    getBook(bookId).then((loadedBook) => {
      if (!active) return;
      setBook(loadedBook || null);
      setReady(true);
    });

    return () => {
      active = false;
    };
  }, [bookId]);

  const handleBack = () => {
    const canGoBack = typeof window !== 'undefined' && window.history.state && window.history.state.idx > 0;
    if (canGoBack) {
      navigate(-1);
      return;
    }
    navigate('/', { replace: true });
  };

  if (!ready) {
    return <div className="glass-card page-message">Загружаем данные книги…</div>;
  }

  if (!book) {
    return (
      <div className="page-stack">
        <section className="glass-card page-message page-message--stacked">
          <h2>{t.book.loadError}</h2>
          <button type="button" className="ghost-button" onClick={handleBack}>
            <ArrowLeft size={16} />
            {t.book.backToLibrary}
          </button>
        </section>
      </div>
    );
  }

  async function handleFavorite() {
    await toggleFavorite(book.id, !book.favorite);
    setBook((prev) => ({ ...prev, favorite: !prev.favorite }));
  }

  async function handleDelete() {
    const confirmed = window.confirm(t.book.deleteConfirm(book.title));
    if (!confirmed) return;
    await deleteBook(book.id);
    navigate('/', { replace: true });
  }

  return (
    <div className="page-stack">
      <section className="book-actions-row">
        <button type="button" className="ghost-button" onClick={handleBack}>
          <ArrowLeft size={16} />
          {t.book.back}
        </button>
      </section>

      <section className="book-hero glass-card">
        <div className="book-hero__cover" style={{ background: `linear-gradient(160deg, ${book.accent}, #101521)` }}>
          <span>{book.format.toUpperCase()}</span>
          <h2>{book.title}</h2>
          <p>{book.author}</p>
        </div>
        <div className="book-hero__body">
          <p className="eyebrow">{t.book.detailsEyebrow}</p>
          <h2>{book.title}</h2>
          <p>{book.author}</p>
          <div className="progress-row">
            <div className="progress-bar"><span style={{ width: `${Math.max(book.progress * 100, 4)}%` }} /></div>
            <strong>{progressToPercent(book.progress)}</strong>
          </div>
          <p className="book-excerpt">{book.excerpt || t.book.noPreview}</p>
          <div className="button-row">
            <Link to={`/reader/${book.id}`} className="primary-button">
              <Play size={18} />
              {t.book.readNow}
            </Link>
            <button className="ghost-button" onClick={handleFavorite}>
              <Heart size={18} />
              {book.favorite ? t.book.removeFavorite : t.book.addFavorite}
            </button>
            <button className="ghost-button ghost-button--danger" onClick={handleDelete}>
              <Trash2 size={18} />
              {t.book.delete}
            </button>
          </div>
        </div>
      </section>

      <section className="details-grid">
        <article className="glass-card detail-card">
          <h3>{t.book.metadata}</h3>
          <dl>
            <div><dt>{t.book.format}</dt><dd>{book.format.toUpperCase()}</dd></div>
            <div><dt>{t.book.fileSize}</dt><dd>{bytesToReadable(book.size)}</dd></div>
            <div><dt>{t.book.added}</dt><dd>{formatDate(book.createdAt)}</dd></div>
            <div><dt>{t.book.updated}</dt><dd>{formatDate(book.updatedAt)}</dd></div>
          </dl>
        </article>
        <article className="glass-card detail-card">
          <h3>{t.book.readingData}</h3>
          <dl>
            <div><dt>{t.book.progress}</dt><dd>{progressToPercent(book.progress)}</dd></div>
            <div><dt>{t.book.status}</dt><dd>{book.progress >= 1 ? t.book.finished : book.progress > 0 ? t.book.reading : t.book.notStarted}</dd></div>
            <div><dt>{t.book.lastOpened}</dt><dd>{book.lastOpenedAt ? formatDate(book.lastOpenedAt) : t.book.never}</dd></div>
            <div><dt>{t.book.estimatedTime}</dt><dd>{book.contentHtml ? readingTimeFromHtml(book.contentHtml) : t.book.dynamic}</dd></div>
          </dl>
        </article>
      </section>
    </div>
  );
}
