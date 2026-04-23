import { BookOpenText, Heart } from 'lucide-react';
import { t } from '../i18n/ru';

export default function AppHeader() {
  return (
    <header className="app-header">
      <div className="brand-block">
        <div className="brand-icon"><BookOpenText size={18} /></div>
        <div>
          <p className="eyebrow">{t.appTagline}</p>
          <h1>{t.appName}</h1>
        </div>
      </div>
      <div className="status-pill">
        <Heart size={14} />
        {t.premiumFlow}
      </div>
    </header>
  );
}
