import React from 'react';
import { render } from 'react-dom';
const extension = require('extensionizer');

import './global.css';
import App from './App';
import { PORT_NAME } from '../constants';

const port = extension.runtime.connect({ name: PORT_NAME.POPUP });

render(<App port={port}/>, document.getElementById('root'));
