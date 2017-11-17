import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { Board } from '../organisms';

import { makeRoomCode } from '../../reducers/actionCreators';

const mapState = null;
const mapDispatch = dispatch => ({
  setUpLocalGame() {
    dispatch(makeRoomCode());
  },
});

class LocalGame extends React.Component {
  componentDidMount() {
    this.props.setUpLocalGame();
  }

  render() {
    return (
      <Grid container>
        <Grid item lg={8}>
          <Board />
          <Typography type="display3" align="right">WORDYSPYS</Typography>
        </Grid>
        <Grid item lg={4}>
          actions and stuff go here
        </Grid>
      </Grid>
    );
  }
}

LocalGame.propTypes = {
  setUpLocalGame: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(LocalGame);
