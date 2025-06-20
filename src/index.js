import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App.js';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/style.css';

axios.defaults.withCredentials = true;

const metaTag = document.createElement('meta');
metaTag.setAttribute('http-equiv', 'Permissions-Policy');
metaTag.setAttribute('content', "accelerometer=(self 'https://www.tiktok.com')");
document.head.appendChild(metaTag);

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);