import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router> {/* Only Router in your app */}
      <AuthProvider> {/* Only AuthProvider in your app */}
        <App />
      </AuthProvider>
    </Router>
  </StrictMode>


);