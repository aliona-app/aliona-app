import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ReaderSettingsSheet from '../components/ReaderSettingsSheet';
import ReaderToolbar from '../components/ReaderToolbar';
import useIsTouchDevice from '../hooks/useIsTouchDevice';
import { t } from '../i18n/ru';
import EpubReader from '../reader/EpubReader';
import FlowReader from '../reader/FlowReader';
import PdfReader from '../reader/PdfReader';
import { addBookmark, getBook, updateBookProgress } from '../storage/db';

export default function ReaderPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const isTouchDevice = useIsTouchDevice();
  const [book, setBook] = useState(null);
  const [ready, setReady] = useState(false);
  const [showChrome, setShowChrome] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [readerApi, setReaderApi] = useState(null);
  const [readerProgress, setReaderProgress] = useState(0);
  const [toast, setToast] = useState('');
  const pendingPatchRef = useRef({ progress: 0, currentLocation: null });
  const persistTimeoutRef = useRef(0);
  const chromeTimeoutRef = useRef(0);
  const toastTimeoutRef = useRef(0);
  const hasLoadedBookRef = useRef(false);

  const hideChromeLater = useCallback((delay = 2200) => {
    clearTimeout(chromeTimeoutRef.current);
    if (!isTouchDevice || settingsOpen) return;
    chromeTimeoutRef.current = window.setTimeout(() => {
      setShowChrome(false);
    }, delay);
  }, [isTouchDevice, settingsOpen]);

  const revealChrome = useCallback((sticky = false) => {
    setShowChrome(true);
    clearTimeout(chromeTimeoutRef.current);
    if (!sticky) hideChromeLater();
  }, [hideChromeLater]);

  const toggleChrome = useCallback(() => {
    setShowChrome((prev) => {
      const next = !prev;
      clearTimeout(chromeTimeoutRef.current);
      if (next && isTouchDevice && !settingsOpen) {
        chromeTimeoutRef.current = window.setTimeout(() => setShowChrome(false), 2200);
      }
      return next;
    });
  }, [isTouchDevice, settingsOpen]);

  const showToast = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = window.setTimeout(() => setToast(''), 1800);
  }, []);

  const flushProgress = useCallback(() => {
    clearTimeout(persistTimeoutRef.current);
    if (!bookId || !hasLoadedBookRef.current) return;
    updateBookProgress(bookId, pendingPatchRef.current);
  }, [bookId]);

  useEffect(() => {
    let isMounted = true;
    setReady(false);
    getBook(bookId).then((loadedBook) => {
      if (!isMounted) return;
      hasLoadedBookRef.current = Boolean(loadedBook);
      setBook(loadedBook || null);
      setReaderProgress(loadedBook?.progress || 0);
      pendingPatchRef.current = {
        progress: loadedBook?.progress || 0,
        currentLocation: loadedBook?.currentLocation || null
      };
      setReady(true);
    });

    return () => {
      isMounted = false;
      flushProgress();
      clearTimeout(chromeTimeoutRef.current);
      clearTimeout(toastTimeoutRef.current);
    };
  }, [bookId, flushProgress]);

  useEffect(() => {
    if (!ready) return undefined;

    const handlePageHide = () => flushProgress();
    window.addEventListener('pagehide', handlePageHide);
    return () => window.removeEventListener('pagehide', handlePageHide);
  }, [flushProgress, ready]);

  useEffect(() => {
    if (!book) return;
    if (isTouchDevice) hideChromeLater(1800);
    else setShowChrome(true);
  }, [book?.id, isTouchDevice, hideChromeLater, book]);

  useEffect(() => {
    if (!settingsOpen && showChrome) hideChromeLater();
  }, [settingsOpen, showChrome, hideChromeLater]);

  const ReaderComponent = useMemo(() => {
    if (!book) return null;
    if (book.format === 'epub') return EpubReader;
    if (book.format === 'pdf') return PdfReader;
    return FlowReader;
  }, [book]);

  const handleBack = useCallback(() => {
    flushProgress();
    const canGoBack = typeof window !== 'undefined' && window.history.state && window.history.state.idx > 0;
    if (canGoBack) {
      navigate(-1);
      return;
    }
    navigate(`/book/${bookId}`, { replace: true });
  }, [bookId, flushProgress, navigate]);

  const goNext = useCallback(() => {
    revealChrome();
    readerApi?.next?.();
  }, [readerApi, revealChrome]);

  const goPrev = useCallback(() => {
    revealChrome();
    readerApi?.prev?.();
  }, [readerApi, revealChrome]);

  const handleProgress = useCallback(
    (payload) => {
      const patch = typeof payload === 'number' ? { progress: payload } : payload;
      const nextProgress = patch.progress ?? 0;

      pendingPatchRef.current = {
        ...pendingPatchRef.current,
        ...patch,
        progress: nextProgress
      };

      setReaderProgress(nextProgress);

      clearTimeout(persistTimeoutRef.current);
      persistTimeoutRef.current = window.setTimeout(() => {
        updateBookProgress(bookId, pendingPatchRef.current);
      }, 320);
    },
    [bookId]
  );

  const handleViewportGesture = useCallback((payload) => {
    if (!payload) return;

    if (payload.type === 'tap-center') {
      toggleChrome();
      return;
    }

    if (payload.type === 'scroll-direction') {
      if (payload.direction === 'up') {
        revealChrome();
      }
      if (payload.direction === 'down') {
        clearTimeout(chromeTimeoutRef.current);
        if (isTouchDevice) setShowChrome(false);
      }
      return;
    }

    if (payload.type === 'interaction') {
      revealChrome();
    }
  }, [toggleChrome, revealChrome, isTouchDevice]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (settingsOpen) return;
      if (event.key === 'ArrowRight' || event.key === 'PageDown') {
        event.preventDefault();
        goNext();
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        goPrev();
      }
      if (event.key === ' ') {
        event.preventDefault();
        goNext();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev, settingsOpen, handleBack]);

  const handleBookmark = useCallback(async () => {
    if (!book) return;
    await addBookmark({
      id: crypto.randomUUID(),
      bookId: book.id,
      title: book.title,
      progress: pendingPatchRef.current.progress || readerProgress || 0,
      createdAt: Date.now()
    });
    revealChrome();
    showToast(t.reader.bookmarkSaved);
  }, [book, readerProgress, revealChrome, showToast]);

  if (!ready) {
    return <div className="reader-loading-screen">{t.reader.loading}</div>;
  }

  if (!book || !ReaderComponent) {
    return (
      <div className="reader-loading-screen reader-loading-screen--stacked">
        <p>{t.reader.notFound}</p>
        <Link className="ghost-button" to="/">
          {t.reader.backToLibrary}
        </Link>
      </div>
    );
  }

  return (
    <div className={`reader-page ${isTouchDevice ? 'mobile-reader' : 'desktop-reader'}`}>
      {showChrome ? (
        <div className="reader-chrome reader-chrome--top">
          <ReaderToolbar
            title={book.title}
            onToggleSettings={() => {
              setSettingsOpen(true);
              revealChrome(true);
            }}
            onBookmark={handleBookmark}
            onBack={handleBack}
            bookId={book.id}
          />
        </div>
      ) : null}

      <div className="reader-stage">
        <ReaderComponent
          book={book}
          initialProgress={book.progress || 0}
          onProgress={handleProgress}
          onReady={setReaderApi}
          isTouchDevice={isTouchDevice}
          onViewportGesture={handleViewportGesture}
        />
      </div>

      {showChrome ? (
        <div className="reader-chrome reader-chrome--bottom">
          <div className="reader-footer glass-card">
            <button className="icon-button icon-button--solid" onClick={goPrev} aria-label={t.reader.previous}>
              <ChevronLeft size={18} />
            </button>
            <span className="reader-footer__meta">{book.author}</span>
            <div className="progress-bar progress-bar--reader"><span style={{ width: `${Math.max(readerProgress * 100, 1)}%` }} /></div>
            <strong>{Math.round(readerProgress * 100)}%</strong>
            <button className="icon-button icon-button--solid" onClick={goNext} aria-label={t.reader.next}>
              <ChevronRight size={18} />
            </button>
          </div>
          {isTouchDevice ? <div className="reader-mobile-hint">{t.reader.centerTapHint}</div> : null}
        </div>
      ) : null}

      {toast ? <div className="reader-toast">{toast}</div> : null}

      <ReaderSettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
