import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { t } from '../i18n/ru';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export default function PdfReader({ book, onProgress, onReady, isTouchDevice = false, onViewportGesture }) {
  const containerRef = useRef(null);
  const pointerStartRef = useRef({ x: 0, y: 0, at: 0, pointerType: 'mouse' });
  const lastScrollRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let objectUrl = '';
    let destroyed = false;
    const canvases = [];

    async function renderPdf() {
      if (!book?.blob || !containerRef.current) return;
      setLoading(true);
      setError('');
      objectUrl = URL.createObjectURL(book.blob);

      try {
        const loadingTask = pdfjsLib.getDocument(objectUrl);
        const pdf = await loadingTask.promise;
        const container = containerRef.current;
        container.innerHTML = '';

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
          if (destroyed) break;
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 1.25 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.className = 'pdf-page';
          container.appendChild(canvas);
          canvases.push(canvas);
          await page.render({ canvasContext: context, viewport }).promise;
        }

        requestAnimationFrame(() => {
          const maxScroll = Math.max(1, container.scrollHeight - container.clientHeight);
          container.scrollTop = (book.progress || 0) * maxScroll;
          lastScrollRef.current = container.scrollTop;
        });
      } catch (err) {
        console.error(err);
        setError(t.reader.pdfError);
      } finally {
        setLoading(false);
      }
    }

    renderPdf();

    const container = containerRef.current;
    const pageStep = () => Math.max(container?.clientHeight * 0.92 || 0, 280);
    onReady?.({
      next: () => container?.scrollBy({ top: pageStep(), behavior: 'smooth' }),
      prev: () => container?.scrollBy({ top: -pageStep(), behavior: 'smooth' })
    });

    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const maxScroll = Math.max(1, container.scrollHeight - container.clientHeight);
        const progress = Math.min(1, container.scrollTop / maxScroll);
        onProgress?.(progress);

        if (isTouchDevice) {
          const delta = container.scrollTop - lastScrollRef.current;
          if (Math.abs(delta) > 14) {
            onViewportGesture?.({
              type: 'scroll-direction',
              direction: delta > 0 ? 'down' : 'up'
            });
            lastScrollRef.current = container.scrollTop;
          }
        }
      });
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
      if (!isTouchDevice) return;
      const start = pointerStartRef.current;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      const isTap = Math.abs(dx) < 12 && Math.abs(dy) < 12 && Date.now() - start.at < 280;
      if (!isTap) return;

      const bounds = container.getBoundingClientRect();
      const xRatio = (event.clientX - bounds.left) / bounds.width;
      const yRatio = (event.clientY - bounds.top) / bounds.height;
      const isCenterTap = xRatio > 0.24 && xRatio < 0.76 && yRatio > 0.18 && yRatio < 0.82;
      if (isCenterTap) {
        onViewportGesture?.({ type: 'tap-center' });
      }
    };

    container?.addEventListener('scroll', handleScroll, { passive: true });
    container?.addEventListener('pointerdown', handlePointerDown);
    container?.addEventListener('pointerup', handlePointerUp);

    return () => {
      destroyed = true;
      onReady?.(null);
      container?.removeEventListener('scroll', handleScroll);
      container?.removeEventListener('pointerdown', handlePointerDown);
      container?.removeEventListener('pointerup', handlePointerUp);
      cancelAnimationFrame(frame);
      canvases.splice(0).forEach((canvas) => {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      });
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [book?.id, onProgress, onReady, isTouchDevice, onViewportGesture, book?.blob, book?.progress]);

  return (
    <div className="pdf-reader-shell">
      {loading ? <div className="reader-loading">{t.reader.renderingPdf}</div> : null}
      {error ? <div className="reader-error">{error}</div> : null}
      <div className="pdf-reader" ref={containerRef} />
    </div>
  );
}
