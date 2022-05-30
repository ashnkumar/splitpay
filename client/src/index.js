import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './n.css'
import './w.css'
import './r.css'

import Header from './StoreComponents/Header'
import StoreHome from './StoreComponents/StoreHome'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Header />
      <StoreHome />
  </React.StrictMode>
);
