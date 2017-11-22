import db from '../../firebase/db';

// constants
const SET_MASTER_TEAM = 'SET_MASTER_TEAM';
const MARK_MASTER_TAKEN = 'MARK_MASTER_TAKEN';

// actions
const setMasterTeam = color => ({ type: SET_MASTER_TEAM, color });
const markMasterTaken = (color, bool) => ({ type: MARK_MASTER_TAKEN, color, bool });

// thunks
export const createSpymasters = () => (dispatch, getState) => {
  db.ref(`rooms/${getState().roomCode.value}/spymasters`).set({
    RED: false,
    BLUE: false,
  })
  .then(() => {
    dispatch(markMasterTaken('RED', false));
    dispatch(markMasterTaken('BLUE', false));
  });
};
export const listenOnSpymasters = () => (dispatch, getState) => {
  const listener = snapshot => {
    if (!snapshot) return;
    const { RED, BLUE } = snapshot.val();
    dispatch(markMasterTaken('RED', RED));
    dispatch(markMasterTaken('BLUE', BLUE));
  };
  db.ref(`rooms/${getState().roomCode.value}/spymasters`).on('value', listener);
  return listener;
};
export const claimMaster = color => (dispatch, getState) => {
  db.ref(`rooms/${getState().roomCode.value}/spymasters`).child(color).set(true)
  .then(() => {
    dispatch(markMasterTaken(color, true));
    dispatch(setMasterTeam(color));
  });
};

// reducer
const initialState = {
  ownTeam: '',
  taken: {
    RED: false,
    BLUE: false,
  },
};
export default function (prevState = initialState, action) {
  const nextState = Object.assign({}, prevState);
  switch (action.type) {
    case MARK_MASTER_TAKEN:
      nextState.taken = Object.assign({}, nextState.taken);
      nextState.taken[action.color] = action.bool;
      return nextState;
    case SET_MASTER_TEAM:
      nextState.ownTeam = action.color;
      return nextState;
    default:
      return prevState;
  }
}
