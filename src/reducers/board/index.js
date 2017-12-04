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
export const createBoard = () => (
  function createBoardThunk(dispatch, getState) {
    let board;
    return generateBoard()
    .then(_board => {
      board = _board;
      return db.ref(`rooms/${getState().roomCode.value}/board`).set(board);
    })
    .then(() => dispatch(setBoard(board)))
    .catch(err => console.error(err));
  }
);
export const listenOnBoard = () => (
  function listenOnBoardThunk(dispatch, getState) {
    const ref = db.ref(`rooms/${getState().roomCode.value}/board`);
    const listener = snapshot => {
      if (!snapshot.val()) return;
      dispatch(setBoard(snapshot.val()));
    };
    ref.on('value', listener);
    return () => ref.off('value', listener);
  }
);
export const revealCard = (rowId, colId) => (
  function revealCardThunk(dispatch, getState) {
    const roomRef = db.ref(`rooms/${getState().roomCode.value}`);
    return roomRef.child(`keyCard/keys/${rowId}/${colId}`).once('value')
    .then(snapshot => {
      if (!snapshot) return null;
      const selectedCardKey = snapshot.val();
      dispatch(validateTurn(selectedCardKey));
      dispatch(setCardStatus(rowId, colId, selectedCardKey));
      return roomRef.child(`board/${rowId}/${colId}/status`).set(selectedCardKey);
    })
    .catch(err => console.error(err));
  }
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
