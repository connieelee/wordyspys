import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSocketIoMiddleware from 'redux-socket.io';

import socket from './socket';
import reducer from './reducers';

const socketIoMiddleware = createSocketIoMiddleware(socket, ['red/', 'blue/']);
const store = createStore(reducer, composeWithDevTools(
  applyMiddleware(socketIoMiddleware),
));

export default store;
