import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const defaultSettings = {
  appDesign: 'tree',
  theme: 'dark',
  fontFamily: 'literata',
  fontSize: 18,
  lineHeight: 1.7,
  pagePadding: 20,
  readingMode: 'scroll',
  textAlign: 'left',
  brightness: 100
};


const appThemeMap = {
  tree: {
    '--bg-base-start': '#0f1612',
    '--bg-base-end': '#09100c',
    '--bg-orb-1': 'rgba(104, 154, 98, 0.22)',
    '--bg-orb-2': 'rgba(173, 119, 67, 0.18)',
    '--surface': 'rgba(18, 28, 21, 0.78)',
    '--surface-strong': 'rgba(24, 35, 27, 0.92)',
    '--surface-border': 'rgba(183, 218, 178, 0.10)',
    '--text': '#eff3ea',
    '--muted': '#a7b8a5',
    '--accent': '#8ea96f',
    '--accent-2': '#d2914f',
    '--shadow': '0 20px 60px rgba(0, 0, 0, 0.34)',
    '--brand-gradient': 'linear-gradient(160deg, rgba(128, 166, 97, 0.88), rgba(196, 132, 74, 0.9))'
  },
  gray: {
    '--bg-base-start': '#121315',
    '--bg-base-end': '#0c0d0f',
    '--bg-orb-1': 'rgba(149, 156, 170, 0.18)',
    '--bg-orb-2': 'rgba(85, 93, 110, 0.14)',
    '--surface': 'rgba(29, 31, 35, 0.82)',
    '--surface-strong': 'rgba(36, 39, 44, 0.94)',
    '--surface-border': 'rgba(255, 255, 255, 0.08)',
    '--text': '#f3f4f6',
    '--muted': '#b1b5be',
    '--accent': '#9ea4b1',
    '--accent-2': '#6d7481',
    '--shadow': '0 20px 60px rgba(0, 0, 0, 0.38)',
    '--brand-gradient': 'linear-gradient(160deg, rgba(145, 151, 164, 0.9), rgba(92, 100, 114, 0.92))'
  },
  aurora: {
    '--bg-base-start': '#0b1020',
    '--bg-base-end': '#070915',
    '--bg-orb-1': 'rgba(72, 192, 172, 0.22)',
    '--bg-orb-2': 'rgba(124, 92, 255, 0.20)',
    '--surface': 'rgba(17, 22, 37, 0.8)',
    '--surface-strong': 'rgba(23, 29, 45, 0.94)',
    '--surface-border': 'rgba(154, 169, 255, 0.12)',
    '--text': '#edf2ff',
    '--muted': '#a9b2d2',
    '--accent': '#6f8cff',
    '--accent-2': '#43c8ad',
    '--shadow': '0 20px 60px rgba(0, 0, 0, 0.42)',
    '--brand-gradient': 'linear-gradient(160deg, rgba(111, 140, 255, 0.92), rgba(67, 200, 173, 0.92))'
  }
};

const themeMap = {
  light: {
    '--reader-bg': '#f6f2ea',
    '--reader-fg': '#211d17',
    '--reader-muted': '#5f564a'
  },
  sepia: {
    '--reader-bg': '#efe4d0',
    '--reader-fg': '#2c241b',
    '--reader-muted': '#6d5c49'
  },
  dark: {
    '--reader-bg': '#0b0d12',
    '--reader-fg': '#f4f0e8',
    '--reader-muted': '#a6a3a0'
  },
  night: {
    '--reader-bg': '#050608',
    '--reader-fg': '#d8d4cb',
    '--reader-muted': '#89847d'
  }
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('velvet-reader-settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('velvet-reader-settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const appThemeVars = appThemeMap[settings.appDesign] ?? appThemeMap.tree;
    Object.entries(appThemeVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    const themeVars = themeMap[settings.theme] ?? themeMap.dark;
    Object.entries(themeVars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
    document.documentElement.style.setProperty('--reader-font-size', `${settings.fontSize}px`);
    document.documentElement.style.setProperty('--reader-line-height', settings.lineHeight);
    document.documentElement.style.setProperty('--reader-padding', `${settings.pagePadding}px`);
    document.documentElement.style.setProperty('--app-brightness', `${settings.brightness}%`);
    document.documentElement.dataset.font = settings.fontFamily;
    document.documentElement.dataset.appDesign = settings.appDesign;
  }, [settings]);

  const value = useMemo(
    () => ({
      settings,
      updateSettings: (patch) => setSettings((prev) => ({ ...prev, ...patch })),
      resetSettings: () => setSettings(defaultSettings)
    }),
    [settings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used inside SettingsProvider');
  }
  return context;
}
