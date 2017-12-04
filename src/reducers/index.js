import { combineReducers } from 'redux';

import board from './board';
import currentTurn from './currentTurn';
import gameOver from './gameOver';
import keyCard from './keyCard';
import roomCode from './roomCode';
import spymasters from './spymasters';

export default combineReducers({
  board,
  currentTurn,
  gameOver,
  keyCard,
  roomCode,
  spymasters,
});
