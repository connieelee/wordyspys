import db from '../../firebase/db';
import board from './board';
import keyCard from './keyCard';

export const testRoom = {
  roomCode: 'test',
  board,
  keyCard,
};

export const seedTestRoom = (config = {}) => {
  if (config.all) return db.ref('rooms/test').set(testRoom);
  const room = { roomCode: 'test' };
  Object.keys(config).forEach(key => {
    if (config[key]) room[key] = testRoom[key];
  });
  return db.ref('rooms/test').set(room);
};
