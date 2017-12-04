export default {
  roomCode: {
    value: 'test',
    errors: [],
  },
  spymasters: {
    ownTeam: '',
    taken: {
      RED: false,
      BLUE: false,
    },
  },
  currentTurn: {
    team: 'Pending',
    clue: null,
    number: null,
    guesses: [],
    isOver: false,
  },
  gameOver: {
    status: false,
    redRemaining: 8,
    blueRemaining: 8,
  },
};
