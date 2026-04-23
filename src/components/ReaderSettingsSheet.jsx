import { RotateCcw, Type, SunMoon } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import useIsTouchDevice from '../hooks/useIsTouchDevice';
import { fontLabels, readingModeLabels, t, themeLabels } from '../i18n/ru';

const themeOptions = ['light', 'sepia', 'dark', 'night'];
const fontOptions = ['literata', 'inter', 'serif'];
const readingModes = ['paginated', 'scroll'];

export default function ReaderSettingsSheet({ open, onClose }) {
  const { settings, updateSettings, resetSettings } = useSettings();
  const isTouchDevice = useIsTouchDevice();
  if (!open) return null;

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <section className="settings-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="settings-sheet__header">
          <div>
            <p className="eyebrow">{t.reader.controlsEyebrow}</p>
            <h3>{t.reader.controlsTitle}</h3>
          </div>
          <button className="icon-button" onClick={resetSettings} aria-label="Сбросить настройки"><RotateCcw size={16} /></button>
        </div>

        <div className="settings-group">
          <label><SunMoon size={16} /> {t.reader.theme}</label>
          <div className="chip-row">
            {themeOptions.map((theme) => (
              <button
                key={theme}
                className={`chip ${settings.theme === theme ? 'is-active' : ''}`}
                onClick={() => updateSettings({ theme })}
              >
                {themeLabels[theme]}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-group">
          <label><Type size={16} /> {t.reader.font}</label>
          <div className="chip-row">
            {fontOptions.map((font) => (
              <button
                key={font}
                className={`chip ${settings.fontFamily === font ? 'is-active' : ''}`}
                onClick={() => updateSettings({ fontFamily: font })}
              >
                {fontLabels[font]}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-group">
          <label>{t.reader.readingMode}</label>
          <div className="chip-row">
            {readingModes.map((mode) => {
              const disabled = isTouchDevice && mode === 'paginated';
              return (
                <button
                  key={mode}
                  className={`chip ${settings.readingMode === mode ? 'is-active' : ''}`}
                  onClick={() => !disabled && updateSettings({ readingMode: mode })}
                  disabled={disabled}
                >
                  {readingModeLabels[mode]}
                </button>
              );
            })}
          </div>
          {isTouchDevice ? <p className="settings-helper settings-helper--reader">{t.reader.mobileModeHint}</p> : null}
        </div>

        <div className="range-field">
          <label>{t.reader.fontSize} <span>{settings.fontSize}px</span></label>
          <input type="range" min="14" max="28" value={settings.fontSize} onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })} />
        </div>

        <div className="range-field">
          <label>{t.reader.lineHeight} <span>{settings.lineHeight.toFixed(1)}</span></label>
          <input type="range" min="1.3" max="2.1" step="0.1" value={settings.lineHeight} onChange={(e) => updateSettings({ lineHeight: Number(e.target.value) })} />
        </div>

        <div className="range-field">
          <label>{t.reader.pagePadding} <span>{settings.pagePadding}px</span></label>
          <input type="range" min="12" max="34" step="1" value={settings.pagePadding} onChange={(e) => updateSettings({ pagePadding: Number(e.target.value) })} />
        </div>

        <div className="range-field">
          <label>{t.reader.brightness} <span>{settings.brightness}%</span></label>
          <input type="range" min="50" max="100" step="1" value={settings.brightness} onChange={(e) => updateSettings({ brightness: Number(e.target.value) })} />
        </div>
      </section>
    </div>
  );
}
