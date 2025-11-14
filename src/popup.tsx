import React from 'react';
import ReactDOM from 'react-dom/client';
import Pomodoro from './Pomodoro';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Pomodoro />
  </React.StrictMode>
);
