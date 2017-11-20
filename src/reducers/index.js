import { combineReducers } from 'redux';

import board from './board';
import roomCode from './roomCode';
import keyCard from './keyCard';

export default combineReducers({
  board,
  roomCode,
  keyCard,
});
