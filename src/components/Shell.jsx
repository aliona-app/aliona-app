import { useLocation } from 'react-router-dom';
import AppHeader from './AppHeader';
import BottomNav from './BottomNav';

export default function Shell({ children }) {
  const location = useLocation();
  const isReader = location.pathname.startsWith('/reader/');

  return (
    <div className={`app-shell ${isReader ? 'reader-active' : ''}`}>
      {!isReader && <AppHeader />}
      <main className={`app-main ${isReader ? 'app-main--reader' : ''}`}>{children}</main>
      {!isReader && <BottomNav />}
    </div>
  );
}
