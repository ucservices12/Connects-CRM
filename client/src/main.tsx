import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from './components/common/Toaster';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './redux/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Provider store={store}>
          <App />
          <Toaster />
        </Provider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
);