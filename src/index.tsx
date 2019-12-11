import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from './Router'
import styled, { createGlobalStyle } from 'styled-components'

const rootEl = document.getElementById('app-root')!

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #eee;
  }
`

const App = styled.div`
  background-color: white;
  max-width: 480px;
  margin: 0 auto;
`

ReactDOM.render(
  <>
    <GlobalStyle />
    <App>
      <Router />
    </App>
  </>,
  rootEl
)
