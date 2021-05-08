import React, { useEffect, useState } from 'react';
import LoginPage from './routes/LoginPage';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import HomePage from './routes/HomePage';
import RegisterPage from './routes/RegisterPage';
import RoomPage from './routes/RoomPage';
import ChatView from './components/chat/ChatView';
import { RealtimeMessageTransport } from './rmt/rtmt';

window.rtmt = new RealtimeMessageTransport()

function App() {
  const [isAuth, setIsAuth] = useState(true);

  useEffect(()=>{
    window.onUnAuth = ()=>{
      console.log("OnUnAuth");
      setIsAuth(false)
    }
  },[]);

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/test" children={<ChatView />} />
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/register">
          <RegisterPage />
        </Route>
        <Route path="/room/:id" children={<RoomPage />} />
        <PrivateRoutes isAuth={isAuth}>
          <Route path="/">
            <HomePage />
          </Route>
        </PrivateRoutes>
      </Switch>
    </BrowserRouter>
  )
}

function PrivateRoutes({ children, isAuth, ...rest }) {
  return (
    <Route {...rest}
      render={({ location }) => {
        if (window.currentUser() && isAuth) {
          return children;
        } else {
          return <Redirect to={{ pathname: "/login", state: { from: location } }}
          />
        }
      }}
    />
  )
}

export default App
