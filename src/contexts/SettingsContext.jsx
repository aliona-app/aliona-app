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
    '--bg-base-start': '#0f1218',
    '--bg-base-end': '#080a0e',
    '--bg-orb-1': 'rgba(100, 112, 132, 0.2)',
    '--bg-orb-2': 'rgba(44, 52, 66, 0.24)',
    '--surface': 'rgba(18, 22, 29, 0.84)',
    '--surface-strong': 'rgba(23, 28, 36, 0.95)',
    '--surface-border': 'rgba(177, 191, 216, 0.1)',
    '--text': '#eef2f8',
    '--muted': '#a9b3c4',
    '--accent': '#8d98ab',
    '--accent-2': '#616b7a',
    '--shadow': '0 20px 60px rgba(0, 0, 0, 0.44)',
    '--brand-gradient': 'linear-gradient(160deg, rgba(154, 166, 186, 0.92), rgba(90, 102, 120, 0.92))'
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
  rose: {
    '--bg-base-start': '#f7edef',
    '--bg-base-end': '#f1e2e7',
    '--bg-orb-1': 'rgba(222, 149, 171, 0.24)',
    '--bg-orb-2': 'rgba(192, 121, 147, 0.16)',
    '--surface': 'rgba(255, 248, 250, 0.84)',
    '--surface-strong': 'rgba(255, 246, 249, 0.96)',
    '--surface-border': 'rgba(143, 97, 113, 0.14)',
    '--text': '#332228',
    '--muted': '#7c626b',
    '--accent': '#c17f96',
    '--accent-2': '#8f5d70',
    '--shadow': '0 18px 50px rgba(135, 89, 104, 0.14)',
    '--brand-gradient': 'linear-gradient(160deg, rgba(206, 140, 163, 0.92), rgba(143, 93, 112, 0.9))'
  },
  mocha: {
    '--bg-base-start': '#19120f',
    '--bg-base-end': '#100a08',
    '--bg-orb-1': 'rgba(170, 126, 97, 0.2)',
    '--bg-orb-2': 'rgba(92, 58, 38, 0.22)',
    '--surface': 'rgba(34, 24, 20, 0.84)',
    '--surface-strong': 'rgba(41, 29, 24, 0.95)',
    '--surface-border': 'rgba(231, 198, 168, 0.1)',
    '--text': '#f7efe7',
    '--muted': '#c8b5a6',
    '--accent': '#c49a79',
    '--accent-2': '#8f6448',
    '--shadow': '0 20px 60px rgba(0, 0, 0, 0.42)',
    '--brand-gradient': 'linear-gradient(160deg, rgba(201, 157, 124, 0.92), rgba(124, 86, 61, 0.92))'
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
  }
};

const themeMap = {
  light: {
    '--reader-bg': '#f6f2ea',
    '--reader-fg': '#211d17',
    '--reader-muted': '#5f564a',
    '--reader-sheet-bg': 'rgba(248, 243, 235, 0.97)',
    '--reader-sheet-border': 'rgba(96, 86, 73, 0.14)',
    '--reader-sheet-text': '#211d17',
    '--reader-sheet-muted': '#665b50',
    '--reader-sheet-chip-bg': 'rgba(255, 255, 255, 0.7)',
    '--reader-sheet-chip-border': 'rgba(96, 86, 73, 0.14)',
    '--reader-sheet-icon-bg': 'rgba(255, 255, 255, 0.7)'
  },
  sepia: {
    '--reader-bg': '#efe4d0',
    '--reader-fg': '#2c241b',
    '--reader-muted': '#6d5c49',
    '--reader-sheet-bg': 'rgba(242, 231, 211, 0.97)',
    '--reader-sheet-border': 'rgba(108, 90, 67, 0.16)',
    '--reader-sheet-text': '#2c241b',
    '--reader-sheet-muted': '#725f4d',
    '--reader-sheet-chip-bg': 'rgba(255, 248, 238, 0.52)',
    '--reader-sheet-chip-border': 'rgba(108, 90, 67, 0.16)',
    '--reader-sheet-icon-bg': 'rgba(255, 248, 238, 0.54)'
  },
  dark: {
    '--reader-bg': '#0b0d12',
    '--reader-fg': '#f4f0e8',
    '--reader-muted': '#a6a3a0',
    '--reader-sheet-bg': 'rgba(18, 20, 26, 0.94)',
    '--reader-sheet-border': 'rgba(255, 255, 255, 0.08)',
    '--reader-sheet-text': '#f4f0e8',
    '--reader-sheet-muted': '#a6a3a0',
    '--reader-sheet-chip-bg': 'rgba(255, 255, 255, 0.05)',
    '--reader-sheet-chip-border': 'rgba(255, 255, 255, 0.08)',
    '--reader-sheet-icon-bg': 'rgba(255, 255, 255, 0.05)'
  },
  night: {
    '--reader-bg': '#050608',
    '--reader-fg': '#d8d4cb',
    '--reader-muted': '#89847d',
    '--reader-sheet-bg': 'rgba(11, 12, 16, 0.96)',
    '--reader-sheet-border': 'rgba(255, 255, 255, 0.07)',
    '--reader-sheet-text': '#ddd8ce',
    '--reader-sheet-muted': '#918c84',
    '--reader-sheet-chip-bg': 'rgba(255, 255, 255, 0.04)',
    '--reader-sheet-chip-border': 'rgba(255, 255, 255, 0.07)',
    '--reader-sheet-icon-bg': 'rgba(255, 255, 255, 0.04)'
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
    document.body.dataset.font = settings.fontFamily;
    document.body.dataset.appDesign = settings.appDesign;
    document.body.dataset.readerTheme = settings.theme;
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
