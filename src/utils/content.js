import { marked } from 'marked';

marked.setOptions({
  breaks: true,
  gfm: true
});

export function hashColor(input = '') {
  const palette = ['#B86A2D', '#7B61FF', '#386BF6', '#0EA57A', '#C35D93', '#D27F33'];
  const hash = [...input].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palette[hash % palette.length];
}

export function escapeHtml(value = '') {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sanitizeHtml(html = '') {
  if (typeof window === 'undefined' || !window.DOMParser) return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  doc.querySelectorAll('script,style,iframe,object,embed,link,meta').forEach((node) => node.remove());
  doc.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attr) => {
      if (attr.name.startsWith('on')) node.removeAttribute(attr.name);
      if ((attr.name === 'href' || attr.name === 'src') && /^javascript:/i.test(attr.value)) {
        node.removeAttribute(attr.name);
      }
    });
  });
  return doc.body.innerHTML;
}

export function txtToHtml(text = '') {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br />')}</p>`)
    .join('');
}

export function markdownToHtml(text = '') {
  return sanitizeHtml(marked.parse(text));
}

export function htmlToHtml(text = '') {
  return sanitizeHtml(text);
}

function directChildren(node, tagName) {
  return [...(node?.children || [])].filter((child) => child.tagName?.toLowerCase() === tagName);
}

function firstDirectChild(node, tagName) {
  return directChildren(node, tagName)[0] || null;
}

function renderParagraphNode(node) {
  const text = node.textContent?.trim() || '';
  if (!text) return '';
  return `<p>${escapeHtml(text)}</p>`;
}

function renderPoemNode(node) {
  const title = firstDirectChild(node, 'title')?.textContent?.trim();
  const stanzas = directChildren(node, 'stanza')
    .map((stanza) => {
      const lines = directChildren(stanza, 'v')
        .map((v) => escapeHtml(v.textContent?.trim() || ''))
        .filter(Boolean)
        .join('<br />');
      return lines ? `<p>${lines}</p>` : '';
    })
    .filter(Boolean)
    .join('');

  if (!title && !stanzas) return '';
  return `<blockquote>${title ? `<strong>${escapeHtml(title)}</strong>` : ''}${stanzas}</blockquote>`;
}

function renderEpigraphNode(node) {
  const paragraphs = directChildren(node, 'p').map(renderParagraphNode).join('');
  return paragraphs ? `<blockquote>${paragraphs}</blockquote>` : '';
}

function renderSectionNode(section, level = 2) {
  const heading = firstDirectChild(section, 'title')?.textContent?.trim();
  const content = [...(section.children || [])]
    .map((node) => {
      const tag = node.tagName?.toLowerCase();
      if (!tag || tag === 'title') return '';
      if (tag === 'section') return renderSectionNode(node, Math.min(level + 1, 4));
      if (tag === 'p') return renderParagraphNode(node);
      if (tag === 'subtitle') return `<h${Math.min(level + 1, 4)}>${escapeHtml(node.textContent?.trim() || '')}</h${Math.min(level + 1, 4)}>`;
      if (tag === 'poem') return renderPoemNode(node);
      if (tag === 'epigraph' || tag === 'cite') return renderEpigraphNode(node);
      if (tag === 'empty-line') return '<div class="reader-spacer"></div>';
      if (tag === 'image') return '';
      return renderParagraphNode(node);
    })
    .join('');

  if (!heading && !content) return '';
  return `${heading ? `<h${level}>${escapeHtml(heading)}</h${level}>` : ''}${content}`;
}

export function fb2ToHtml(text = '') {
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'application/xml');
  const title = xml.querySelector('book-title')?.textContent?.trim() ?? '';
  const body = xml.querySelector('FictionBook > body') || xml.querySelector('body');
  const sections = body ? directChildren(body, 'section') : [];
  const html = sections.map((section) => renderSectionNode(section, 2)).join('');
  return `${title ? `<h1>${escapeHtml(title)}</h1>` : ''}${html}`;
}
