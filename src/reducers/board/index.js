import db from '../../firebase/db';
import { generateBoard } from '../../utils/game';
import { validateTurn } from '../actionCreators';

// constants
const SET_BOARD = 'SET_BOARD';
const SET_CARD_STATUS = 'SET_CARD_STATUS';

// actions
const setBoard = board => ({ type: SET_BOARD, board });
const setCardStatus = (rowId, colId, status) => ({
  type: SET_CARD_STATUS,
  rowId,
  colId,
  status,
});

// thunks
export const createBoard = () => (dispatch, getState) => {
  let board;
  return generateBoard()
  .then(_board => {
    board = _board;
    return db.ref(`rooms/${getState().roomCode.value}/board`).set(board);
  })
  .then(() => dispatch(setBoard(board)))
  .catch(err => console.error(err));
};
export const revealCard = (rowId, colId) => (dispatch, getState) => (
  db.ref(`rooms/${getState().roomCode.value}/keyCard/keys`)
  .child(rowId).child(colId).once('value')
  .then(snapshot => {
    if (!snapshot) return;
    const selectedCardKey = snapshot.val();
    dispatch(validateTurn(selectedCardKey));
    dispatch(setCardStatus(rowId, colId, selectedCardKey));
  })
  .catch(err => console.error(err))
);

// reducer
const initialState = [];
export default function (prevState = initialState, action) {
  const nextState = [...prevState];
  switch (action.type) {
    case SET_BOARD:
      return action.board;
    case SET_CARD_STATUS: {
      const { rowId, colId, status } = action;
      nextState[rowId] = [...nextState[rowId]];
      nextState[rowId][colId] = Object.assign({}, nextState[rowId][colId]);
      nextState[rowId][colId].status = status;
      return nextState;
    }
    default:
      return prevState;
  }
}
