import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from './context/store.context.tsx';
import './index.scss';
import App from './App.tsx';
import { setupInterceptors } from './lib/axios';
import { rootStore } from './stores/root.store';

// Set up Axios interceptor for token refresh
setupInterceptors(rootStore);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>,
);
