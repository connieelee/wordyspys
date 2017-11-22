import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './style.css';
import initializeFirebaseApp from './firebase/initialize';
import store from './store';

import {
  Home,
  LocalGame,
  SpyMasters,
} from './components';

initializeFirebaseApp();

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route path="/local" component={LocalGame} />
        <Route path="/masters" component={SpyMasters} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
