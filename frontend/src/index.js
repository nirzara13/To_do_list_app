

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// Vérification des variables d'environnement au démarrage
console.log("Variables d'environnement au démarrage:");
console.log("REACT_APP_RECAPTCHA_SITE_KEY:", process.env.REACT_APP_RECAPTCHA_SITE_KEY);
console.log("REACT_APP_API_URL:", process.env.REACT_APP_API_URL);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
