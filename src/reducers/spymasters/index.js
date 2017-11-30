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
export const createSpymasters = () => (
  function createSpymastersThunk(dispatch, getState) {
    return db.ref(`rooms/${getState().roomCode.value}/spymasters`).set({
      RED: false,
      BLUE: false,
    })
    .then(() => {
      dispatch(markMasterTaken('RED', false));
      dispatch(markMasterTaken('BLUE', false));
    })
    .catch(err => console.error(err));
  }
);
export const listenOnSpymasters = () => (
  function listenOnSpymastersThunk(dispatch, getState) {
    const ref = db.ref(`rooms/${getState().roomCode.value}/spymasters`);
    const createListener = teamColor => snapshot => {
      const updatedValue = snapshot.val();
      if (updatedValue !== null) dispatch(markMasterTaken(teamColor, updatedValue));
    };
    const redListener = createListener('RED');
    const blueListener = createListener('BLUE');
    ref.child('RED').on('value', redListener);
    ref.child('BLUE').on('value', blueListener);
    return () => {
      ref.child('RED').off('value', redListener);
      ref.child('BLUE').off('value', blueListener);
    };
  }
);
export const claimMaster = color => (
  function claimMasterThunk(dispatch, getState) {
    return db.ref(`rooms/${getState().roomCode.value}/spymasters/${color}`).set(true)
    .then(() => dispatch(setMasterTeam(color)))
    .catch(err => console.error(err));
  }
);
export const disconnectMaster = () => (
  function disconnectMasterThunk(dispatch, getState) {
    const ownTeam = getState().spymasters.ownTeam;
    const code = getState().roomCode.value;
    if (!ownTeam || !code) return null;
    return db.ref(`rooms/${code}/spymasters/${ownTeam}`).set(false)
    .then(() => dispatch(unsetMasterTeam()))
    .catch(err => console.error(err));
  }
);

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
