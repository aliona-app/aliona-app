import { Download, Smartphone, WifiOff } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import useIsTouchDevice from '../hooks/useIsTouchDevice';
import { readingModeLabels, t } from '../i18n/ru';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const isTouchDevice = useIsTouchDevice();

  return (
    <div className="page-stack">
      <section className="glass-card section-header-card">
        <p className="eyebrow">{t.settings.eyebrow}</p>
        <h2>{t.settings.title}</h2>
        <p>{t.settings.copy}</p>
      </section>

      <section className="details-grid">
        <article className="glass-card detail-card">
          <h3><Smartphone size={18} /> {t.settings.installation}</h3>
          <p>{t.settings.installationCopy}</p>
        </article>
        <article className="glass-card detail-card">
          <h3><WifiOff size={18} /> {t.settings.offline}</h3>
          <p>{t.settings.offlineCopy}</p>
        </article>
        <article className="glass-card detail-card">
          <h3><Download size={18} /> {t.settings.readerMode}</h3>
          <div className="chip-row">
            <button className={`chip ${settings.readingMode === 'scroll' ? 'is-active' : ''}`} onClick={() => updateSettings({ readingMode: 'scroll' })}>
              {readingModeLabels.scroll}
            </button>
            <button
              className={`chip ${settings.readingMode === 'paginated' ? 'is-active' : ''}`}
              onClick={() => !isTouchDevice && updateSettings({ readingMode: 'paginated' })}
              disabled={isTouchDevice}
            >
              {readingModeLabels.paginated}
            </button>
          </div>
          <p className="settings-helper">{isTouchDevice ? t.settings.mobileForcedMode : t.settings.readerModeCopy}</p>
        </article>
        <article className="glass-card detail-card">
          <h3>{t.settings.mobileUxTitle}</h3>
          <p>{t.settings.mobileUxCopy}</p>
        </article>
      </section>
    </div>
  );
}
