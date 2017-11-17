import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { Board, CurrentAction } from '../organisms';

import { makeRoomCode } from '../../reducers/actionCreators';

const mapState = null;
const mapDispatch = dispatch => ({
  setup() {
    dispatch(makeRoomCode());
  },
  disconnect() {
    // should remove room from db
  },
});

class LocalGame extends React.Component {
  componentDidMount() {
    this.props.setup();
  }

  componentWillUnmount() {
    this.props.disconnect();
  }

  render() {
    return (
      <Grid container>
        <Grid item lg={8}>
          <Board />
          <Typography type="display3" align="right">WORDYSPYS</Typography>
        </Grid>
        <Grid item lg={4}>
          <CurrentAction />
        </Grid>
      </Grid>
    );
  }
}

LocalGame.propTypes = {
  setup: PropTypes.func.isRequired,
  disconnect: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(LocalGame);
