import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { SettingsProvider } from './contexts/SettingsContext';
import { t } from './i18n/ru';
import './styles/global.css';

registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (registration) {
      console.info(t.common.serviceWorkerRegistered, swUrl);
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </HashRouter>
  </React.StrictMode>
);
