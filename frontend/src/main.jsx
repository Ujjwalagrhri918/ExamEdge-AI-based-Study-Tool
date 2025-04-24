import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { UploadProvider } from "./context/UploadContext.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <UploadProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UploadProvider>
  </AuthProvider>
);
