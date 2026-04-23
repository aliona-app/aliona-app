import { BookmarkX, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLiveLibrary } from '../hooks/useLiveLibrary';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, removeBookmark } from '../storage/db';
import { t } from '../i18n/ru';
import { formatDate, progressToPercent } from '../utils/formatters';

export default function BookmarksPage() {
  const library = useLiveLibrary();
  const bookmarks = useLiveQuery(() => db.bookmarks.orderBy('createdAt').reverse().toArray(), [], []);

  async function handleDelete(id) {
    await removeBookmark(id);
  }

  const bookMap = new Map((library || []).map((book) => [book.id, book]));

  return (
    <div className="page-stack">
      <section className="glass-card section-header-card">
        <p className="eyebrow">{t.bookmarks.eyebrow}</p>
        <h2>{t.bookmarks.title}</h2>
        <p>{t.bookmarks.copy}</p>
      </section>

      <section className="bookmark-list">
        {bookmarks?.length ? bookmarks.map((item) => {
          const book = bookMap.get(item.bookId);
          return (
            <article key={item.id} className="glass-card bookmark-card">
              <div>
                <p className="eyebrow">{book?.title || t.bookmarks.removedBook}</p>
                <h3>{progressToPercent(item.progress)}</h3>
                <p>{formatDate(item.createdAt)}</p>
              </div>
              <div className="bookmark-card__actions">
                {book ? <Link className="ghost-button" to={`/reader/${item.bookId}`}><ChevronRight size={16} /> {t.bookmarks.open}</Link> : null}
                <button className="ghost-button ghost-button--danger" onClick={() => handleDelete(item.id)}>
                  <BookmarkX size={16} /> {t.bookmarks.remove}
                </button>
              </div>
            </article>
          );
        }) : <div className="glass-card page-message">{t.bookmarks.empty}</div>}
      </section>
    </div>
  );
}
