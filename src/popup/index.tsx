import * as React from 'react'
import { render } from 'react-dom'

import App from './App'
import './global.css'
import { PORT_NAME } from '../constants'

const port = chrome.runtime.connect({ name: PORT_NAME.POPUP })

render(<App port={port}/>, document.getElementById('root'))
