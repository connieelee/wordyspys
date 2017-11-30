import db from '../../firebase/db';
import board from './board';
import keyCard from './keyCard';

export const testRoom = {
  roomCode: 'test',
  board,
  keyCard,
  spymasters: {
    ownTeam: '',
    taken: {
      RED: false,
      BLUE: false,
    },
  },
};

export const seedTestRoom = (config = {}) => {
  const room = { roomCode: 'test' };
  Object.keys(config).forEach(key => {
    if (config[key]) room[key] = testRoom[key];
  });
  return db.ref('rooms/test').set(room);
};
