import { generateBoard } from '../../utils';
import db from '../../firebase/db';

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
  .then(() => dispatch(setBoard(board)));
};
export const revealCard = (rowId, colId) => (dispatch, getState) => (
  db.ref(`rooms/${getState().roomCode.value}/keyCard/keys/${rowId}/${colId}`)
  .once('value')
  .then(snapshot => {
    dispatch(setCardStatus(rowId, colId, snapshot.val()));
  })
);

// reducer
const initialState = [];
export default function (prevState = initialState, action) {
  const nextState = [...prevState];
  switch (action.type) {
    case SET_BOARD:
      return action.board;
    case SET_CARD_STATUS:
      nextState[action.rowId] = [...nextState[action.rowId]];
      nextState[action.rowId][action.colId] = Object.assign({}, nextState[action.rowId][action.colId]);
      nextState[action.rowId][action.colId].status = action.status;
      return nextState;
    default:
      return prevState;
  }
}
