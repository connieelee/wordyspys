import { combineReducers } from 'redux';

import board from './board';
import roomCode from './roomCode';
import keyCard from './keyCard';
import spymasters from './spymasters';
import currentMove from './currentMove';

export default combineReducers({
  board,
  roomCode,
  keyCard,
  currentMove,
  spymasters,
});
