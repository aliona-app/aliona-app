import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const defaultSettings = {
  appDesign: 'gray',
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
  graphite: {
    '--bg-base-start': '#0e1117',
    '--bg-base-end': '#07090d',
    '--bg-orb-1': 'rgba(78, 95, 122, 0.22)',
    '--bg-orb-2': 'rgba(30, 36, 49, 0.26)',
    '--surface': 'rgba(17, 21, 28, 0.84)',
    '--surface-strong': 'rgba(20, 25, 33, 0.95)',
    '--surface-border': 'rgba(154, 181, 219, 0.11)',
    '--text': '#eef4ff',
    '--muted': '#aab7cf',
    '--accent': '#8ba3c7',
    '--accent-2': '#5f7393',
    '--shadow': '0 20px 60px rgba(0, 0, 0, 0.42)',
    '--brand-gradient': 'linear-gradient(160deg, rgba(146, 169, 204, 0.92), rgba(79, 97, 123, 0.92))'
  },
  paper: {
    '--bg-base-start': '#f5efe3',
    '--bg-base-end': '#efe4d4',
    '--bg-orb-1': 'rgba(222, 193, 143, 0.28)',
    '--bg-orb-2': 'rgba(184, 148, 104, 0.18)',
    '--surface': 'rgba(255, 250, 243, 0.82)',
    '--surface-strong': 'rgba(255, 248, 238, 0.96)',
    '--surface-border': 'rgba(112, 82, 45, 0.12)',
    '--text': '#2e2417',
    '--muted': '#77654f',
    '--accent': '#bd8b4f',
    '--accent-2': '#8d6940',
    '--shadow': '0 18px 50px rgba(116, 87, 44, 0.14)',
    '--brand-gradient': 'linear-gradient(160deg, rgba(197, 146, 82, 0.92), rgba(141, 105, 64, 0.9))'
  },
  plum: {
    '--bg-base-start': '#18111d',
    '--bg-base-end': '#0f0914',
    '--bg-orb-1': 'rgba(173, 112, 183, 0.22)',
    '--bg-orb-2': 'rgba(97, 62, 140, 0.22)',
    '--surface': 'rgba(33, 22, 39, 0.82)',
    '--surface-strong': 'rgba(40, 26, 47, 0.95)',
    '--surface-border': 'rgba(233, 188, 255, 0.10)',
    '--text': '#f8eefb',
    '--muted': '#c8b1cf',
    '--accent': '#c794d6',
    '--accent-2': '#8a65bf',
    '--shadow': '0 20px 60px rgba(0, 0, 0, 0.40)',
    '--brand-gradient': 'linear-gradient(160deg, rgba(204, 144, 223, 0.92), rgba(123, 95, 191, 0.92))'
  },
  emerald: {
    '--bg-base-start': '#0d1714',
    '--bg-base-end': '#07100d',
    '--bg-orb-1': 'rgba(74, 175, 145, 0.22)',
    '--bg-orb-2': 'rgba(42, 108, 95, 0.18)',
    '--surface': 'rgba(16, 30, 26, 0.82)',
    '--surface-strong': 'rgba(19, 36, 31, 0.95)',
    '--surface-border': 'rgba(160, 231, 210, 0.10)',
    '--text': '#effaf6',
    '--muted': '#acc9c0',
    '--accent': '#55b39d',
    '--accent-2': '#2f7f72',
    '--shadow': '0 20px 60px rgba(0, 0, 0, 0.38)',
    '--brand-gradient': 'linear-gradient(160deg, rgba(91, 188, 163, 0.92), rgba(48, 130, 115, 0.92))'
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
    const appThemeVars = appThemeMap[settings.appDesign] ?? appThemeMap.gray;
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
    document.documentElement.dataset.readerTheme = settings.theme;
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
