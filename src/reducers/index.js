import { combineReducers } from 'redux';

import board from './board';
import roomCode from './roomCode';

export default combineReducers({
  board,
  roomCode,
  // keyCard,
});
