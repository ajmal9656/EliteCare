import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '../index.css';
import { Provider } from 'react-redux';
import { store, persistor } from './Redux/store'; // Named import
import { PersistGate } from 'redux-persist/integration/react';
import { SocketProvider } from './Context/SocketIO.tsx';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      
      <PersistGate loading={null} persistor={persistor}>
      <SocketProvider>
        <App />
        </SocketProvider>
      </PersistGate>
    </Provider>
  // </StrictMode>,
);
