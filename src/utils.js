import db from './firebase/db';

const randomAlphanumericString = length => {
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randIdx = () => Math.floor(Math.random() * alphanumeric.length);
  return new Array(length).fill().map(() => alphanumeric[randIdx()]).join('');
};
export const generateRoomCode = () => {
  const code = randomAlphanumericString(4);
  return db.ref(`rooms/${code}`).once('value')
    .then(snapshot => {
      if (snapshot.val()) return generateRoomCode(db);
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
  // create 5x5 grid with slots labeled for RED, BLUE, NEUTRAL, or ASSASSIN
  // determine which team goes first and assign spots accordingly
};
