import ePub from 'epubjs';
import { saveBook } from '../storage/db';
import { t } from '../i18n/ru';
import { fb2ToHtml, hashColor, htmlToHtml, markdownToHtml, txtToHtml } from './content';

const supportedFormats = ['epub', 'fb2', 'txt', 'pdf', 'html', 'htm', 'md'];

function getFormat(name = '') {
  return name.split('.').pop()?.toLowerCase() || '';
}

function humanFormat(ext) {
  return ext === 'htm' ? 'html' : ext;
}

async function extractEpubMetadata(file) {
  try {
    const buffer = await file.arrayBuffer();
    const book = ePub(buffer);
    await book.ready;
    const metadata = await book.loaded.metadata;
    let cover = '';
    try {
      const coverUrl = await book.coverUrl();
      cover = coverUrl || '';
    } catch {
      cover = '';
    }
    book.destroy();
    return {
      title: metadata?.title?.trim() || file.name.replace(/\.[^.]+$/, ''),
      author: metadata?.creator?.trim() || t.common.unknownAuthor,
      cover
    };
  } catch {
    return {
      title: file.name.replace(/\.[^.]+$/, ''),
      author: t.common.unknownAuthor,
      cover: ''
    };
  }
}

async function buildBookRecord(file) {
  const ext = getFormat(file.name);
  if (!supportedFormats.includes(ext)) {
    throw new Error(`${t.import.unsupported}: ${ext || 'unknown'}`);
  }

  const id = crypto.randomUUID();
  const baseRecord = {
    id,
    fileName: file.name,
    title: file.name.replace(/\.[^.]+$/, ''),
    author: t.common.unknownAuthor,
    format: humanFormat(ext),
    size: file.size,
    blob: file,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    lastOpenedAt: 0,
    favorite: false,
    progress: 0,
    accent: hashColor(file.name),
    cover: '',
    currentLocation: null,
    contentHtml: '',
    excerpt: '',
    status: 'new'
  };

  if (ext === 'epub') {
    const meta = await extractEpubMetadata(file);
    return {
      ...baseRecord,
      ...meta,
      excerpt: 'EPUB импортирован и готов к чтению.'
    };
  }

  if (ext === 'pdf') {
    return {
      ...baseRecord,
      excerpt: 'PDF импортирован и готов к вертикальной прокрутке.'
    };
  }

  const text = await file.text();
  let contentHtml = '';

  if (ext === 'txt') contentHtml = txtToHtml(text);
  if (ext === 'md') contentHtml = markdownToHtml(text);
  if (ext === 'html' || ext === 'htm') contentHtml = htmlToHtml(text);
  if (ext === 'fb2') {
    contentHtml = fb2ToHtml(text);
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, 'application/xml');
    const title = xml.querySelector('book-title')?.textContent?.trim();
    const first = xml.querySelector('first-name')?.textContent?.trim();
    const last = xml.querySelector('last-name')?.textContent?.trim();
    if (title) baseRecord.title = title;
    if (first || last) baseRecord.author = `${first || ''} ${last || ''}`.trim();
  }

  const excerpt = contentHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 140);
  return {
    ...baseRecord,
    contentHtml,
    excerpt: excerpt || 'Книга импортирована и подготовлена для чтения.'
  };
}

export async function importFiles(files = []) {
  const entries = [];
  for (const file of files) {
    const record = await buildBookRecord(file);
    await saveBook(record);
    entries.push(record);
  }
  return entries;
}

export function getAcceptedTypes() {
  return '.epub,.fb2,.txt,.pdf,.html,.htm,.md';
}
