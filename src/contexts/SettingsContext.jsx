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
    '--brand-gradient': 'linear-gradient(160deg, rgba(145, 151, 164, 0.9), rgba(92, 100, 114, 0.92))',
    '--control-bg': 'rgba(255, 255, 255, 0.05)',
    '--control-bg-hover': 'rgba(255, 255, 255, 0.08)',
    '--control-border': 'rgba(255, 255, 255, 0.10)',
    '--control-text': '#f3f4f6',
    '--control-strong-bg': 'rgba(34, 37, 42, 0.96)',
    '--control-strong-border': 'rgba(255, 255, 255, 0.10)',
    '--control-strong-text': '#f7f8fb',
    '--control-active-bg': 'rgba(158, 164, 177, 0.18)',
    '--control-active-border': 'rgba(158, 164, 177, 0.42)',
    '--control-active-text': '#ffffff',
    '--nav-active-bg': 'rgba(255,255,255,0.08)',
    '--nav-active-text': '#ffffff'
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
    '--brand-gradient': 'linear-gradient(160deg, rgba(154, 166, 186, 0.92), rgba(90, 102, 120, 0.92))',
    '--control-bg': 'rgba(255, 255, 255, 0.045)',
    '--control-bg-hover': 'rgba(255, 255, 255, 0.08)',
    '--control-border': 'rgba(177, 191, 216, 0.14)',
    '--control-text': '#eef2f8',
    '--control-strong-bg': 'rgba(26, 31, 40, 0.98)',
    '--control-strong-border': 'rgba(177, 191, 216, 0.16)',
    '--control-strong-text': '#f5f8fd',
    '--control-active-bg': 'rgba(141, 152, 171, 0.18)',
    '--control-active-border': 'rgba(141, 152, 171, 0.42)',
    '--control-active-text': '#ffffff',
    '--nav-active-bg': 'rgba(255,255,255,0.08)',
    '--nav-active-text': '#ffffff'
  },
  paper: {
    '--bg-base-start': '#f8f0e5',
    '--bg-base-end': '#f2e5d3',
    '--bg-orb-1': 'rgba(227, 197, 147, 0.28)',
    '--bg-orb-2': 'rgba(198, 160, 112, 0.18)',
    '--surface': 'rgba(255, 250, 243, 0.88)',
    '--surface-strong': 'rgba(255, 248, 240, 0.98)',
    '--surface-border': 'rgba(134, 103, 60, 0.14)',
    '--text': '#2f2418',
    '--muted': '#786651',
    '--accent': '#c39457',
    '--accent-2': '#906943',
    '--shadow': '0 18px 50px rgba(116, 87, 44, 0.14)',
    '--brand-gradient': 'linear-gradient(160deg, rgba(211, 171, 111, 0.95), rgba(154, 116, 71, 0.9))',
    '--control-bg': 'rgba(255, 255, 255, 0.76)',
    '--control-bg-hover': 'rgba(255, 255, 255, 0.92)',
    '--control-border': 'rgba(134, 103, 60, 0.16)',
    '--control-text': '#2f2418',
    '--control-strong-bg': 'rgba(247, 238, 225, 0.98)',
    '--control-strong-border': 'rgba(134, 103, 60, 0.16)',
    '--control-strong-text': '#2f2418',
    '--control-active-bg': 'rgba(195, 148, 87, 0.16)',
    '--control-active-border': 'rgba(195, 148, 87, 0.36)',
    '--control-active-text': '#2f2418',
    '--nav-active-bg': 'rgba(195, 148, 87, 0.14)',
    '--nav-active-text': '#2f2418'
  },
  rose: {
    '--bg-base-start': '#f8edf1',
    '--bg-base-end': '#f2e1e8',
    '--bg-orb-1': 'rgba(222, 149, 171, 0.24)',
    '--bg-orb-2': 'rgba(192, 121, 147, 0.16)',
    '--surface': 'rgba(255, 248, 250, 0.86)',
    '--surface-strong': 'rgba(255, 246, 249, 0.98)',
    '--surface-border': 'rgba(143, 97, 113, 0.14)',
    '--text': '#332228',
    '--muted': '#7c626b',
    '--accent': '#c17f96',
    '--accent-2': '#8f5d70',
    '--shadow': '0 18px 50px rgba(135, 89, 104, 0.14)',
    '--brand-gradient': 'linear-gradient(160deg, rgba(206, 140, 163, 0.92), rgba(143, 93, 112, 0.9))',
    '--control-bg': 'rgba(255, 255, 255, 0.74)',
    '--control-bg-hover': 'rgba(255, 255, 255, 0.92)',
    '--control-border': 'rgba(143, 97, 113, 0.16)',
    '--control-text': '#332228',
    '--control-strong-bg': 'rgba(249, 240, 244, 0.98)',
    '--control-strong-border': 'rgba(143, 97, 113, 0.16)',
    '--control-strong-text': '#332228',
    '--control-active-bg': 'rgba(193, 127, 150, 0.16)',
    '--control-active-border': 'rgba(193, 127, 150, 0.36)',
    '--control-active-text': '#332228',
    '--nav-active-bg': 'rgba(193, 127, 150, 0.14)',
    '--nav-active-text': '#332228'
  },
  mocha: {
    '--bg-base-start': '#eef3ec',
    '--bg-base-end': '#e1e9de',
    '--bg-orb-1': 'rgba(132, 167, 142, 0.24)',
    '--bg-orb-2': 'rgba(101, 132, 112, 0.16)',
    '--surface': 'rgba(248, 252, 247, 0.86)',
    '--surface-strong': 'rgba(243, 249, 242, 0.98)',
    '--surface-border': 'rgba(93, 115, 98, 0.14)',
    '--text': '#243028',
    '--muted': '#65756a',
    '--accent': '#7e9f88',
    '--accent-2': '#58705f',
    '--shadow': '0 18px 50px rgba(83, 106, 88, 0.14)',
    '--brand-gradient': 'linear-gradient(160deg, rgba(132, 166, 143, 0.94), rgba(88, 112, 95, 0.92))',
    '--control-bg': 'rgba(255, 255, 255, 0.76)',
    '--control-bg-hover': 'rgba(255, 255, 255, 0.92)',
    '--control-border': 'rgba(93, 115, 98, 0.16)',
    '--control-text': '#243028',
    '--control-strong-bg': 'rgba(236, 244, 234, 0.98)',
    '--control-strong-border': 'rgba(93, 115, 98, 0.16)',
    '--control-strong-text': '#243028',
    '--control-active-bg': 'rgba(126, 159, 136, 0.18)',
    '--control-active-border': 'rgba(126, 159, 136, 0.38)',
    '--control-active-text': '#243028',
    '--nav-active-bg': 'rgba(126, 159, 136, 0.16)',
    '--nav-active-text': '#243028'
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
    '--brand-gradient': 'linear-gradient(160deg, rgba(204, 144, 223, 0.92), rgba(123, 95, 191, 0.92))',
    '--control-bg': 'rgba(255, 255, 255, 0.05)',
    '--control-bg-hover': 'rgba(255, 255, 255, 0.08)',
    '--control-border': 'rgba(233, 188, 255, 0.12)',
    '--control-text': '#f8eefb',
    '--control-strong-bg': 'rgba(41, 28, 50, 0.98)',
    '--control-strong-border': 'rgba(233, 188, 255, 0.12)',
    '--control-strong-text': '#f8eefb',
    '--control-active-bg': 'rgba(199, 148, 214, 0.18)',
    '--control-active-border': 'rgba(199, 148, 214, 0.42)',
    '--control-active-text': '#ffffff',
    '--nav-active-bg': 'rgba(255,255,255,0.08)',
    '--nav-active-text': '#ffffff'
  }
};

const themeMap = {
  light: {
    '--reader-bg': '#f6f2ea',
    '--reader-fg': '#211d17',
    '--reader-muted': '#5f564a',
    '--reader-sheet-bg': '#f8f3eb',
    '--reader-sheet-border': 'rgba(96, 86, 73, 0.14)',
    '--reader-sheet-text': '#211d17',
    '--reader-sheet-muted': '#665b50',
    '--reader-sheet-chip-bg': 'rgba(255, 255, 255, 0.88)',
    '--reader-sheet-chip-border': 'rgba(96, 86, 73, 0.14)',
    '--reader-sheet-icon-bg': 'rgba(255, 255, 255, 0.88)',
    '--reader-surface': 'rgba(248, 243, 235, 0.96)',
    '--reader-surface-border': 'rgba(96, 86, 73, 0.14)',
    '--reader-control-bg': 'rgba(255, 255, 255, 0.92)',
    '--reader-control-border': 'rgba(96, 86, 73, 0.16)',
    '--reader-control-text': '#211d17',
    '--reader-control-strong-bg': 'rgba(245, 238, 227, 0.98)',
    '--reader-control-strong-border': 'rgba(96, 86, 73, 0.16)',
    '--reader-control-strong-text': '#211d17',
    '--reader-control-active-bg': 'rgba(173, 145, 102, 0.15)',
    '--reader-control-active-border': 'rgba(173, 145, 102, 0.34)',
    '--reader-control-active-text': '#211d17',
    '--reader-progress-track': 'rgba(96, 86, 73, 0.14)'
  },
  sepia: {
    '--reader-bg': '#efe4d0',
    '--reader-fg': '#2c241b',
    '--reader-muted': '#6d5c49',
    '--reader-sheet-bg': '#f2e7d3',
    '--reader-sheet-border': 'rgba(108, 90, 67, 0.16)',
    '--reader-sheet-text': '#2c241b',
    '--reader-sheet-muted': '#725f4d',
    '--reader-sheet-chip-bg': 'rgba(255, 249, 239, 0.82)',
    '--reader-sheet-chip-border': 'rgba(108, 90, 67, 0.16)',
    '--reader-sheet-icon-bg': 'rgba(255, 249, 239, 0.82)',
    '--reader-surface': 'rgba(242, 231, 211, 0.96)',
    '--reader-surface-border': 'rgba(108, 90, 67, 0.16)',
    '--reader-control-bg': 'rgba(255, 249, 239, 0.92)',
    '--reader-control-border': 'rgba(108, 90, 67, 0.18)',
    '--reader-control-text': '#2c241b',
    '--reader-control-strong-bg': 'rgba(238, 224, 198, 0.98)',
    '--reader-control-strong-border': 'rgba(108, 90, 67, 0.18)',
    '--reader-control-strong-text': '#2c241b',
    '--reader-control-active-bg': 'rgba(174, 140, 90, 0.16)',
    '--reader-control-active-border': 'rgba(174, 140, 90, 0.34)',
    '--reader-control-active-text': '#2c241b',
    '--reader-progress-track': 'rgba(108, 90, 67, 0.16)'
  },
  dark: {
    '--reader-bg': '#0b0d12',
    '--reader-fg': '#f4f0e8',
    '--reader-muted': '#a6a3a0',
    '--reader-sheet-bg': 'rgba(18, 20, 26, 0.98)',
    '--reader-sheet-border': 'rgba(255, 255, 255, 0.08)',
    '--reader-sheet-text': '#f4f0e8',
    '--reader-sheet-muted': '#a6a3a0',
    '--reader-sheet-chip-bg': 'rgba(255, 255, 255, 0.05)',
    '--reader-sheet-chip-border': 'rgba(255, 255, 255, 0.08)',
    '--reader-sheet-icon-bg': 'rgba(255, 255, 255, 0.05)',
    '--reader-surface': 'rgba(18, 20, 26, 0.92)',
    '--reader-surface-border': 'rgba(255, 255, 255, 0.08)',
    '--reader-control-bg': 'rgba(255, 255, 255, 0.05)',
    '--reader-control-border': 'rgba(255, 255, 255, 0.08)',
    '--reader-control-text': '#f4f0e8',
    '--reader-control-strong-bg': 'rgba(15, 18, 24, 0.98)',
    '--reader-control-strong-border': 'rgba(255, 255, 255, 0.08)',
    '--reader-control-strong-text': '#f4f0e8',
    '--reader-control-active-bg': 'rgba(255, 255, 255, 0.10)',
    '--reader-control-active-border': 'rgba(255, 255, 255, 0.16)',
    '--reader-control-active-text': '#ffffff',
    '--reader-progress-track': 'rgba(255,255,255,0.12)'
  },
  night: {
    '--reader-bg': '#050608',
    '--reader-fg': '#d8d4cb',
    '--reader-muted': '#89847d',
    '--reader-sheet-bg': 'rgba(11, 12, 16, 0.98)',
    '--reader-sheet-border': 'rgba(255, 255, 255, 0.07)',
    '--reader-sheet-text': '#ddd8ce',
    '--reader-sheet-muted': '#918c84',
    '--reader-sheet-chip-bg': 'rgba(255, 255, 255, 0.04)',
    '--reader-sheet-chip-border': 'rgba(255, 255, 255, 0.07)',
    '--reader-sheet-icon-bg': 'rgba(255, 255, 255, 0.04)',
    '--reader-surface': 'rgba(11, 12, 16, 0.94)',
    '--reader-surface-border': 'rgba(255, 255, 255, 0.07)',
    '--reader-control-bg': 'rgba(255, 255, 255, 0.04)',
    '--reader-control-border': 'rgba(255, 255, 255, 0.07)',
    '--reader-control-text': '#ddd8ce',
    '--reader-control-strong-bg': 'rgba(9, 10, 14, 0.98)',
    '--reader-control-strong-border': 'rgba(255, 255, 255, 0.07)',
    '--reader-control-strong-text': '#ddd8ce',
    '--reader-control-active-bg': 'rgba(255, 255, 255, 0.10)',
    '--reader-control-active-border': 'rgba(255, 255, 255, 0.14)',
    '--reader-control-active-text': '#ffffff',
    '--reader-progress-track': 'rgba(255,255,255,0.10)'
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
