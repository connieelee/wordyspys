import db from '../../firebase/db';

// constants
const SET_MASTER_TEAM = 'SET_MASTER_TEAM';
const UNSET_MASTER_TEAM = 'UNSET_MASTER_TEAM';
const MARK_MASTER_TAKEN = 'MARK_MASTER_TAKEN';

// actions
const setMasterTeam = color => ({ type: SET_MASTER_TEAM, color });
const unsetMasterTeam = color => ({ type: UNSET_MASTER_TEAM, color });
const markMasterTaken = (color, bool) => ({ type: MARK_MASTER_TAKEN, color, bool });

// thunks
export const createSpymasters = () => (dispatch, getState) => (
  db.ref(`rooms/${getState().roomCode.value}/spymasters`).set({
    RED: false,
    BLUE: false,
  })
  .then(() => {
    dispatch(markMasterTaken('RED', false));
    dispatch(markMasterTaken('BLUE', false));
  })
);
export const listenOnSpymasters = () => (dispatch, getState) => {
  const ref = db.ref(`rooms/${getState().roomCode.value}/spymasters`);
  const listener = snapshot => {
    if (!snapshot) return;
    if (!snapshot.val()) return;
    const { RED: newRed, BLUE: newBlue } = snapshot.val();
    const { RED: prevRed, BLUE: prevBlue } = getState().spymasters.taken;
    if (newRed !== prevRed) dispatch(markMasterTaken('RED', newRed));
    if (newBlue !== prevBlue) dispatch(markMasterTaken('BLUE', newBlue));
  };
  ref.on('value', listener);
  return () => ref.off('value', listener);
};
export const claimMaster = color => (dispatch, getState) => (
  db.ref(`rooms/${getState().roomCode.value}/spymasters/${color}`).set(true)
  .then(() => dispatch(setMasterTeam(color)))
);
export const disconnectMaster = () => (dispatch, getState) => {
  const ownTeam = getState().spymasters.ownTeam;
  const code = getState().roomCode.value;
  console.log('ownTeam', ownTeam, 'code', code);
  if (!ownTeam) return null;
  console.log('about to set false at:', `rooms/${code}/spymasters/${ownTeam}`);
  return db.ref(`rooms/${code}/spymasters/${ownTeam}`).set(false)
  .then(() => {
    console.log('in then');
    dispatch(unsetMasterTeam());
  })
  .catch(err => console.error(err));
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
    case UNSET_MASTER_TEAM:
      nextState.ownTeam = '';
      return nextState;
    default:
      return prevState;
  }
}
