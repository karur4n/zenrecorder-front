import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { IndexPage } from './pages/IndexPage'
import { RoomPage } from './pages/RoomPage/RoomPage'

export const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Route path="/" exact component={IndexPage} />
      <Route path="/rooms/:roomId" component={RoomPage} />
    </BrowserRouter>
  )
}
