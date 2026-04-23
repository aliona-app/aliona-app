import Dexie from 'dexie';

export const db = new Dexie('velvetReaderDB');

db.version(1).stores({
  books: 'id, title, author, format, createdAt, updatedAt, lastOpenedAt, favorite, progress',
  bookmarks: 'id, bookId, createdAt'
});

export async function getAllBooks() {
  return db.books.orderBy('updatedAt').reverse().toArray();
}

export async function getBook(id) {
  return db.books.get(id);
}

export async function saveBook(book) {
  await db.books.put(book);
  return book.id;
}

export async function deleteBook(id) {
  await db.bookmarks.where('bookId').equals(id).delete();
  await db.books.delete(id);
}

export async function toggleFavorite(id, favorite) {
  const book = await db.books.get(id);
  if (!book) return;
  await db.books.update(id, { favorite, updatedAt: Date.now() });
}

export async function updateBookProgress(id, progressPatch) {
  await db.books.update(id, {
    ...progressPatch,
    updatedAt: Date.now(),
    lastOpenedAt: Date.now()
  });
}

export async function getBookmarks(bookId) {
  return db.bookmarks.where('bookId').equals(bookId).reverse().sortBy('createdAt');
}

export async function addBookmark(bookmark) {
  await db.bookmarks.put(bookmark);
}

export async function removeBookmark(id) {
  await db.bookmarks.delete(id);
}
