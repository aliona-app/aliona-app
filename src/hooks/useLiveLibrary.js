import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../storage/db';

export function useLiveLibrary() {
  return useLiveQuery(() => db.books.orderBy('updatedAt').reverse().toArray(), [], []);
}

export function useLiveBookmarks(bookId) {
  return useLiveQuery(
    () => db.bookmarks.where('bookId').equals(bookId).reverse().sortBy('createdAt'),
    [bookId],
    []
  );
}
