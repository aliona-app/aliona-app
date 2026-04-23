export function bytesToReadable(bytes = 0) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
}

export function progressToPercent(progress = 0) {
  return `${Math.round((progress || 0) * 100)}%`;
}

export function formatDate(ts) {
  if (!ts) return '—';
  return new Intl.DateTimeFormat('ru-RU', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(ts));
}

export function readingTimeFromHtml(html = '') {
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} мин чтения`;
}
