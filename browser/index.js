import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';

import {
  AppContainer,
  Home,
  NewGame,
  JoinGame,
  Lobby,
} from './components';

import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route path="/" component={AppContainer} />
        <Route path="/home" component={Home} />
        <Route path="/new" component={NewGame} />
        <Route path="/join" component={JoinGame} />
        <Route path="/lobby" component={Lobby} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
