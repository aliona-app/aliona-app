import { Search, SlidersHorizontal, Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import BookCard from '../components/BookCard';
import ContinueReading from '../components/ContinueReading';
import EmptyLibrary from '../components/EmptyLibrary';
import ImportButton from '../components/ImportButton';
import { t } from '../i18n/ru';
import { useLiveLibrary } from '../hooks/useLiveLibrary';

export default function LibraryPage() {
  const books = useLiveLibrary();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('updatedAt');
  const [importMessage, setImportMessage] = useState('');

  const filtered = useMemo(() => {
    const list = [...(books || [])];
    const normalized = query.trim().toLowerCase();
    const searched = normalized
      ? list.filter((book) => `${book.title} ${book.author} ${book.format}`.toLowerCase().includes(normalized))
      : list;

    const bucketed = searched.filter((book) => {
      if (filter === 'reading') return book.progress > 0 && book.progress < 1;
      if (filter === 'finished') return book.progress >= 1;
      if (filter === 'favorites') return book.favorite;
      return true;
    });

    const sorter = {
      updatedAt: (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0),
      title: (a, b) => a.title.localeCompare(b.title, 'ru'),
      author: (a, b) => a.author.localeCompare(b.author, 'ru'),
      progress: (a, b) => (b.progress || 0) - (a.progress || 0)
    }[sort];

    return bucketed.sort(sorter);
  }, [books, filter, query, sort]);

  const currentBook = useMemo(
    () => [...(books || [])].sort((a, b) => (b.lastOpenedAt || 0) - (a.lastOpenedAt || 0)).find((book) => book.progress > 0 && book.progress < 1),
    [books]
  );

  return (
    <div className="page-stack page-stack--library">
      <section className="hero-panel glass-card hero-panel--welcome">
        <div className="hero-panel__copy">
          <p className="eyebrow">{t.library.eyebrow}</p>
          <h2>{t.library.title}</h2>
          <p className="hero-copy">{t.library.copy}</p>
          <p className="hero-helper">{t.library.helper}</p>
          <div className="hero-badge">
            <Download size={16} />
            {t.library.localBadge}
          </div>
        </div>
        <div className="hero-panel__cta">
          <ImportButton onImported={(imported) => setImportMessage(t.import.success(imported.length))} />
          <div className="hero-panel__quick-tip">
            <strong>{t.library.quickImportTitle}</strong>
            <p>{importMessage || t.library.quickImportCopy}</p>
          </div>
        </div>
      </section>

      <ContinueReading book={currentBook} />

      <section className="controls-panel glass-card">
        <div className="search-field">
          <Search size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.library.searchPlaceholder} />
        </div>
        <div className="control-row">
          <div className="select-field">
            <SlidersHorizontal size={16} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">{t.library.filterAll}</option>
              <option value="reading">{t.library.filterReading}</option>
              <option value="finished">{t.library.filterFinished}</option>
              <option value="favorites">{t.library.filterFavorites}</option>
            </select>
          </div>
          <div className="select-field">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="updatedAt">{t.library.sortUpdatedAt}</option>
              <option value="title">{t.library.sortTitle}</option>
              <option value="author">{t.library.sortAuthor}</option>
              <option value="progress">{t.library.sortProgress}</option>
            </select>
          </div>
        </div>
      </section>

      {!books?.length ? (
        <EmptyLibrary />
      ) : (
        <section className="books-grid">
          {filtered.map((book) => <BookCard key={book.id} book={book} />)}
        </section>
      )}
    </div>
  );
}
