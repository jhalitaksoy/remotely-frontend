import React from 'react';
import LoginPage from './routes/LoginPage';
import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";
import HomePage from './routes/HomePage';
import RegisterPage from './routes/RegisterPage';
import RoomPage from './routes/RoomPage';
import ChatView from './components/chat/ChatView';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/test" children={<ChatView />} />
        <Route path="/room/:id" children={<RoomPage />} />
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/register">
          <RegisterPage />
        </Route>
        <Route path="/">
          <HomePage />
        </Route>
      </Switch>
    </BrowserRouter>
  )
}

export default App;
