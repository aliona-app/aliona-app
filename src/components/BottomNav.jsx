import { LibraryBig, Bookmark, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { t } from '../i18n/ru';

const items = [
  { to: '/', label: t.nav.library, icon: LibraryBig },
  { to: '/bookmarks', label: t.nav.bookmarks, icon: Bookmark },
  { to: '/settings', label: t.nav.settings, icon: Settings }
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}>
          <Icon size={18} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
