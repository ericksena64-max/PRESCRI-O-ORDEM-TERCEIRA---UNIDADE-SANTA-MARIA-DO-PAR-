import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for offline capability during hospital network outages
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('Nova versão da aplicação disponível.');
  },
  onOfflineReady() {
    console.log('Hospital Ordem Terceira pronto para funcionamento offline.');
  }
});

createRoot(document.getElementById('root')!).render(<App />);
