const randomAlphanumericString = length => {
  const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randIdx = () => Math.floor(Math.random() * alphanumeric.length);
  return new Array(length).fill().map(() => alphanumeric[randIdx()]).join('');
};

export const generateRoomCode = db => {
  const code = randomAlphanumericString(4);
  return db.ref(`rooms/${code}`).once('value')
    .then(snapshot => {
      if (snapshot.val()) return generateRoomCode(db);
      return code;
    });
};

export const generateBoard = () => {
  // randomly select 25 unique words from words list to form 5x5 array
};

export const generateKeyCard = () => {
  // create 5x5 grid with slots labeled for RED, BLUE, NEUTRAL, or ASSASSIN
  // determine which team goes first and assign spots accordingly
};
