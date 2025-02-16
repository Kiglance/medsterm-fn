import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import App from './App';
import './index.css';

global.React = React;

if (process.env.NODE_ENV === 'development') {
  global.console.log = () => {};
}

const container = document.getElementById('root');
ReactDOMClient.createRoot(container).render(<App />);
