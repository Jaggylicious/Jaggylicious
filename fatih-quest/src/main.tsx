import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import { ProfileProvider } from './core/store';
import './index.css';

/**
 * Updates van de app worden nooit midden in een oefening doorgevoerd:
 * alleen wanneer het kind op het startscherm is (of bij de volgende start).
 */
let pendingUpdate = false;
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    pendingUpdate = true;
    applyIfSafe();
  },
});
function onHome() {
  const h = window.location.hash.replace(/^#\/?/, '');
  return h === '' || h === 'home';
}
function applyIfSafe() {
  if (pendingUpdate && onHome()) void updateSW(true);
}
window.addEventListener('hashchange', applyIfSafe);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProfileProvider>
      <App />
    </ProfileProvider>
  </StrictMode>,
);
