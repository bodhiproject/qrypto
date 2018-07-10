import React from 'react';
import { render } from 'react-dom';

import './global.css';
import App from './App';
import { PORT_NAME } from '../constants';

const port = chrome.runtime.connect({ name: PORT_NAME.POPUP });

render(<App port={port}/>, document.getElementById('root'));
