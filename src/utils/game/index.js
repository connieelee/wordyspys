import _ from 'underscore';
import db from '../../firebase/db';

const makeValidCode = length => {
  const validChars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const randIdx = () => Math.floor(Math.random() * validChars.length);
  return new Array(length).fill().map(() => validChars[randIdx()]).join('');
};
export const generateRoomCode = () => {
  const code = makeValidCode(4);
  return db.ref(`rooms/${code}`).once('value')
  .then(snapshot => {
    if (snapshot.val()) return generateRoomCode();
    return code;
  });
};

const uniqueRandomNums = (min, max, length) => {
  const nums = [];
  while (nums.length < length) {
    const num = Math.floor(Math.random() * (max - min));
    if (nums.indexOf(num) === -1) nums.push(num);
  }
  return nums;
};
export const generateBoard = () => {
  const emptyBoard = [[], [], [], [], []];
  return db.ref('words').once('value')
  .then(snapshot => {
    const wordBank = snapshot.val();
    return uniqueRandomNums(0, wordBank.length, 25)
    .map(idx => wordBank[idx])
    .reduce((board, word, i) => {
      const card = { word, status: 'UNTOUCHED' };
      board[Math.floor(i / 5)].push(card);
      return board;
    }, emptyBoard);
  });
};

export const generateKeyCard = () => {
  const startingTeam = Math.floor(Math.random() * 2) ? 'RED' : 'BLUE';
  const keys = [];
  const reds = new Array(startingTeam === 'RED' ? 9 : 8).fill('RED');
  const blues = new Array(startingTeam === 'BLUE' ? 9 : 8).fill('BLUE');
  const neutrals = new Array(7).fill('NEUTRAL');
  const shuffled = _.shuffle([...reds, ...blues, ...neutrals, 'ASSASSIN']);
  for (let i = 0; i < shuffled.length; i += 5) {
    keys.push(shuffled.slice(i, i + 5));
  }
  return {
    keys,
    startingTeam,
  };
};
