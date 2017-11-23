import { combineReducers } from 'redux';

import board from './board';
import roomCode from './roomCode';
import keyCard from './keyCard';
import spymasters from './spymasters';
import currentTurn from './currentTurn';

export default combineReducers({
  board,
  roomCode,
  keyCard,
  currentTurn,
  spymasters,
});
