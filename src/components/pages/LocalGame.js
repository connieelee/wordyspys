import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import {
  Board,
  SpyMastersStatus,
  CurrentTurn,
  PastTurns,
} from '../organisms';

import {
  createRoom,
  createBoard,
  createKeyCard,
  createSpymasters,
  listenOnSpymasters,
  listenOnCurrentTurn,
  deleteRoom,
} from '../../reducers/actionCreators';

const mapState = null;
const mapDispatch = dispatch => ({
  setup: () => (
    dispatch(createRoom())
    .then(() => {
      dispatch(createBoard());
      dispatch(createKeyCard());
      dispatch(createSpymasters());
    })
  ),
  disconnect: () => dispatch(deleteRoom()),
  listenOnSpymasters: () => dispatch(listenOnSpymasters()),
  listenOnCurrentTurn: () => dispatch(listenOnCurrentTurn()),
});

class LocalGame extends React.Component {
  componentDidMount() {
    this.props.setup()
    .then(() => {
      const unsubscribes = [];
      unsubscribes.push(this.props.listenOnSpymasters());
      unsubscribes.push(this.props.listenOnCurrentTurn());
      this.stopListeners = unsubscribes.forEach(func => () => func());
    });
    window.addEventListener('beforeunload', () => {
      this.props.disconnect();
    });
  }

  componentWillUnmount() {
    this.props.disconnect();
    if (this.stopListening) this.stopListening();
  }

  render() {
    return (
      <Grid container className="full-height">
        <Grid item lg={8} container alignItems="center" justify="center" style={{ backgroundColor: '#607D8B' }}>
          <Board item />
        </Grid>
        <Grid item lg={4} style={{ width: '100%' }}>
          <Grid item><SpyMastersStatus /></Grid>
          <Grid item><CurrentTurn /></Grid>
          <Grid item><PastTurns /></Grid>
        </Grid>
      </Grid>
    );
  }
}

LocalGame.propTypes = {
  setup: PropTypes.func.isRequired,
  listenOnSpymasters: PropTypes.func.isRequired,
  listenOnCurrentTurn: PropTypes.func.isRequired,
  disconnect: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(LocalGame);
