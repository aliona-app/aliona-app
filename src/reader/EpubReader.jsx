import ePub from 'epubjs';
import { useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { getEffectiveReadingMode } from '../utils/readerMode';

export default function EpubReader({ book, onProgress, onReady, isTouchDevice = false, onViewportGesture }) {
  const mountRef = useRef(null);
  const renditionRef = useRef(null);
  const epubRef = useRef(null);
  const initialLocationRef = useRef(book?.currentLocation?.cfi || undefined);
  const { settings } = useSettings();
  const readingMode = getEffectiveReadingMode(settings.readingMode, isTouchDevice, book?.format);

  useEffect(() => {
    initialLocationRef.current = book?.currentLocation?.cfi || undefined;
  }, [book?.id]);

  useEffect(() => {
    let objectUrl = '';
    let isMounted = true;
    let touchStartX = 0;
    let touchStartY = 0;

    async function init() {
      if (!mountRef.current || !book?.blob) return;
      objectUrl = URL.createObjectURL(book.blob);
      const epub = ePub(objectUrl);
      epubRef.current = epub;
      await epub.ready;
      if (!isMounted) return;

      const rendition = epub.renderTo(mountRef.current, {
        width: '100%',
        height: '100%',
        flow: readingMode === 'scroll' ? 'scrolled-doc' : 'paginated',
        manager: readingMode === 'scroll' ? 'continuous' : 'default'
      });
      renditionRef.current = rendition;

      rendition.themes.default({
        body: {
          background: 'var(--reader-bg) !important',
          color: 'var(--reader-fg) !important',
          'font-size': `${settings.fontSize}px !important`,
          'line-height': `${settings.lineHeight} !important`,
          'padding-left': `${settings.pagePadding}px !important`,
          'padding-right': `${settings.pagePadding}px !important`,
          'font-family': settings.fontFamily === 'inter' ? 'system-ui, sans-serif' : settings.fontFamily === 'serif' ? 'Georgia, serif' : 'Georgia, serif'
        },
        p: {
          color: 'var(--reader-fg) !important'
        },
        h1: { color: 'var(--reader-fg) !important' },
        h2: { color: 'var(--reader-fg) !important' },
        h3: { color: 'var(--reader-fg) !important' }
      });

      rendition.on('relocated', (location) => {
        const percentage = location?.start?.percentage ?? 0;
        onProgress?.({
          progress: percentage,
          currentLocation: {
            cfi: location?.start?.cfi || null
          }
        });
      });

      rendition.on('click', (event) => {
        const width = event?.view?.innerWidth || mountRef.current?.clientWidth || 1;
        const height = event?.view?.innerHeight || mountRef.current?.clientHeight || 1;
        const x = event?.clientX ?? width / 2;
        const y = event?.clientY ?? height / 2;
        const xRatio = x / width;
        const yRatio = y / height;
        const isCenterTap = xRatio > 0.24 && xRatio < 0.76 && yRatio > 0.18 && yRatio < 0.82;
        if (isCenterTap && isTouchDevice) {
          onViewportGesture?.({ type: 'tap-center' });
        }
      });

      onReady?.({
        next: () => rendition.next(),
        prev: () => rendition.prev()
      });

      const handleTouchStart = (event) => {
        const touch = event.changedTouches?.[0];
        touchStartX = touch?.clientX || 0;
        touchStartY = touch?.clientY || 0;
      };

      const handleTouchEnd = (event) => {
        if (readingMode === 'scroll') return;
        const touch = event.changedTouches?.[0];
        if (!touch) return;
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        if (Math.abs(dx) < 48 || Math.abs(dy) > 80) return;
        if (dx < 0) rendition.next();
        if (dx > 0) rendition.prev();
      };

      mountRef.current.addEventListener('touchstart', handleTouchStart, { passive: true });
      mountRef.current.addEventListener('touchend', handleTouchEnd, { passive: true });

      await rendition.display(initialLocationRef.current || undefined);

      return () => {
        mountRef.current?.removeEventListener('touchstart', handleTouchStart);
        mountRef.current?.removeEventListener('touchend', handleTouchEnd);
      };
    }

    let cleanupTouches;
    init().then((cleanup) => {
      cleanupTouches = cleanup;
    });

    return () => {
      isMounted = false;
      cleanupTouches?.();
      onReady?.(null);
      renditionRef.current?.destroy();
      epubRef.current?.destroy();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [
    book?.id,
    onProgress,
    onReady,
    readingMode,
    settings.fontFamily,
    settings.fontSize,
    settings.lineHeight,
    settings.pagePadding,
    isTouchDevice,
    onViewportGesture,
    book?.blob
  ]);

  useEffect(() => {
    const rendition = renditionRef.current;
    if (!rendition) return;
    rendition.themes.fontSize(`${settings.fontSize}px`);
  }, [settings.fontSize]);

  return <div className="epub-reader" ref={mountRef} />;
}
