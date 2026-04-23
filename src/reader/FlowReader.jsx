import { useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { getEffectiveReadingMode } from '../utils/readerMode';

export default function FlowReader({
  book,
  initialProgress = 0,
  onProgress,
  onReady,
  isTouchDevice = false,
  onViewportGesture
}) {
  const containerRef = useRef(null);
  const lastScrollRef = useRef(0);
  const pointerStartRef = useRef({ x: 0, y: 0, at: 0, pointerType: 'mouse' });
  const restoredProgressRef = useRef(initialProgress || 0);
  const { settings } = useSettings();
  const readingMode = getEffectiveReadingMode(settings.readingMode, isTouchDevice, book?.format);

  useEffect(() => {
    restoredProgressRef.current = initialProgress || 0;
  }, [book?.id]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let frame = 0;
    let touchStartX = 0;
    let touchStartY = 0;
    let lastWheelAt = 0;
    const isPaginated = readingMode === 'paginated';
    const restoredProgress = restoredProgressRef.current || 0;

    const verticalStep = () => Math.max(container.clientHeight * 0.9, 240);
    const horizontalStep = () => Math.max(container.clientWidth, 280);

    const next = () => {
      if (isPaginated) {
        container.scrollBy({ left: horizontalStep(), behavior: 'smooth' });
        return;
      }
      container.scrollBy({ top: verticalStep(), behavior: 'smooth' });
    };

    const prev = () => {
      if (isPaginated) {
        container.scrollBy({ left: -horizontalStep(), behavior: 'smooth' });
        return;
      }
      container.scrollBy({ top: -verticalStep(), behavior: 'smooth' });
    };

    const emitProgress = () => {
      if (isPaginated) {
        const maxScroll = Math.max(1, container.scrollWidth - container.clientWidth);
        const progress = Math.min(1, container.scrollLeft / maxScroll);
        onProgress?.(progress);
        return;
      }

      const maxScroll = Math.max(1, container.scrollHeight - container.clientHeight);
      const progress = Math.min(1, container.scrollTop / maxScroll);
      onProgress?.(progress);
    };

    onReady?.({ next, prev });

    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!isPaginated && isTouchDevice) {
          const nextScroll = container.scrollTop;
          const delta = nextScroll - lastScrollRef.current;
          if (Math.abs(delta) > 14) {
            onViewportGesture?.({
              type: 'scroll-direction',
              direction: delta > 0 ? 'down' : 'up'
            });
            lastScrollRef.current = nextScroll;
          }
        }
        emitProgress();
      });
    };

    const handleTouchStart = (event) => {
      const touch = event.changedTouches?.[0];
      touchStartX = touch?.clientX || 0;
      touchStartY = touch?.clientY || 0;
    };

    const handleTouchEnd = (event) => {
      const touch = event.changedTouches?.[0];
      if (!touch) return;
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      if (!isPaginated) return;
      if (Math.abs(dx) < 44 || Math.abs(dy) > 90) return;
      if (dx < 0) next();
      if (dx > 0) prev();
    };

    const handleWheel = (event) => {
      if (!isPaginated) return;
      const intent = Math.abs(event.deltaY) > Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(intent) < 12) return;

      const now = Date.now();
      if (now - lastWheelAt < 240) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      lastWheelAt = now;
      if (intent > 0) next();
      if (intent < 0) prev();
    };

    const handlePointerDown = (event) => {
      pointerStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        at: Date.now(),
        pointerType: event.pointerType || 'mouse'
      };
    };

    const handlePointerUp = (event) => {
      if (window.getSelection?.()?.toString()) return;

      const start = pointerStartRef.current;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      const isTap = Math.abs(dx) < 12 && Math.abs(dy) < 12 && Date.now() - start.at < 280;
      if (!isTap) return;

      const bounds = container.getBoundingClientRect();
      const xRatio = (event.clientX - bounds.left) / bounds.width;
      const yRatio = (event.clientY - bounds.top) / bounds.height;

      if (!isTouchDevice && isPaginated) {
        if (xRatio < 0.28) prev();
        if (xRatio > 0.72) next();
        if (xRatio < 0.28 || xRatio > 0.72) return;
      }

      const isCenterTap = xRatio > 0.24 && xRatio < 0.76 && yRatio > 0.18 && yRatio < 0.82;
      if (isCenterTap && (isTouchDevice || start.pointerType === 'touch')) {
        onViewportGesture?.({ type: 'tap-center' });
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointerup', handlePointerUp);

    requestAnimationFrame(() => {
      if (isPaginated) {
        const maxScroll = Math.max(1, container.scrollWidth - container.clientWidth);
        container.scrollLeft = restoredProgress * maxScroll;
      } else {
        const maxScroll = Math.max(1, container.scrollHeight - container.clientHeight);
        container.scrollTop = restoredProgress * maxScroll;
        lastScrollRef.current = container.scrollTop;
      }
      emitProgress();
    });

    return () => {
      onReady?.(null);
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointerup', handlePointerUp);
      cancelAnimationFrame(frame);
    };
  }, [book?.id, book?.contentHtml, onProgress, onReady, readingMode, isTouchDevice, onViewportGesture]);

  return (
    <section
      className={`flow-reader ${readingMode === 'paginated' ? 'flow-reader--paginated' : 'flow-reader--scroll'}`}
      ref={containerRef}
    >
      <article className="reader-prose" dangerouslySetInnerHTML={{ __html: book.contentHtml }} />
    </section>
  );
}
