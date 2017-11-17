import { generateBoard } from '../utils';

// constants
const SET = 'SET';

// actions
const set = board => ({
  type: SET,
  board,
});

// thunks
export const getBoard = () => dispatch => (
  generateBoard()
  .then(board => dispatch(set(board)))
);

// reducer
export default function (prevState = [], action) {
  switch (action.type) {
    case SET:
      return action.board;
    default:
      return prevState;
  }
}
