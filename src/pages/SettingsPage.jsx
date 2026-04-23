import { Download, Palette, Smartphone, WifiOff } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import useIsTouchDevice from '../hooks/useIsTouchDevice';
import { appDesignLabels, readingModeLabels, t } from '../i18n/ru';

const appDesignOptions = ['tree', 'gray', 'aurora'];

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

      <section className="glass-card detail-card detail-card--designs">
        <h3><Palette size={18} /> {t.settings.appDesign}</h3>
        <p>{t.settings.appDesignCopy}</p>
        <div className="design-grid">
          {appDesignOptions.map((design) => (
            <button
              key={design}
              type="button"
              className={`design-card design-card--${design} ${settings.appDesign === design ? 'is-active' : ''}`}
              onClick={() => updateSettings({ appDesign: design })}
              aria-pressed={settings.appDesign === design}
            >
              <span className="design-card__swatches" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <strong>{appDesignLabels[design]}</strong>
            </button>
          ))}
        </div>
        <p className="settings-helper">{t.settings.appDesignHint}</p>
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
