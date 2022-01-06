import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Toast, Dialog, ProgressBar } from '@pk-design/react-ui-kit'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './scss/app.scss';

const { ToastProvider } = Toast
const { DialogProvider } = Dialog
const { ProgressBarProvider } = ProgressBar

ReactDOM.render(
  <BrowserRouter>
    <ProgressBarProvider>
      <ToastProvider position='bottom-right' autoDismiss={false} container='#toast-container'>
        <DialogProvider container='#dialog-container'>
          <App />
          <div id='dialog-container' className='text-default' />
          <div id='toast-container' className='text-default' />
        </DialogProvider>
      </ToastProvider>
    </ProgressBarProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
