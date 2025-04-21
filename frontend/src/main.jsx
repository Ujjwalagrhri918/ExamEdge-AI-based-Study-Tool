import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { UploadProvider } from "./context/UploadContext.jsx";

createRoot(document.getElementById('root')).render(
  <UploadProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UploadProvider> // Corrected the closing tag
);
