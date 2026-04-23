import { Routes, Route, Navigate } from 'react-router-dom';
import Shell from './components/Shell';
import LibraryPage from './pages/LibraryPage';
import BookDetailsPage from './pages/BookDetailsPage';
import ReaderPage from './pages/ReaderPage';
import BookmarksPage from './pages/BookmarksPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/book/:bookId" element={<BookDetailsPage />} />
        <Route path="/reader/:bookId" element={<ReaderPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
}
