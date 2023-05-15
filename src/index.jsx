import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'

import Container from './javascript/Container.jsx'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('synth')
  ReactDOM.render(<Container />, container)
})
