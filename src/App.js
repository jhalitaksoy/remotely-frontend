import React from 'react';
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
import { currentUser } from './controller/UserController';


function App() {
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
        <PrivateRoutes>
          <Route path="/">
            <HomePage />
          </Route>
        </PrivateRoutes>
      </Switch>
    </BrowserRouter>
  )
}

function PrivateRoutes({ children, ...rest }) {
  return (
    <Route {...rest}
      render={({ location }) => {
        if (currentUser()) {
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
