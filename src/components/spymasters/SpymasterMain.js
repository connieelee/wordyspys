import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { KeyCard, ActiveSpymaster, InactiveSpymaster } from './';

import { listenOnCurrentTurn } from '../../reducers/actionCreators';

const mapState = state => ({
  ownTeam: state.spymasters.ownTeam,
  currentTeam: state.currentTurn.team,
});
const mapDispatch = dispatch => ({
  listenOnCurrentTurn: () => dispatch(listenOnCurrentTurn()),
});

class SpymasterMain extends React.Component {
  componentDidMount() {
    this.stopListening = this.props.listenOnCurrentTurn();
  }

  componentWillUnmount() {
    this.stopListening();
  }

  render() {
    const { ownTeam, currentTeam } = this.props;
    return (
      <Grid
        item
        container
        direction="column"
        alignItems="center"
        justify="space-between"
      >
        <Grid item>
          <Typography type="headline" align="center">KEY CARD</Typography>
          <KeyCard />
        </Grid>
        <Grid item>
          <Typography type="headline" align="center">{ownTeam} SPYMASTER</Typography>
          {currentTeam === ownTeam ?
            <ActiveSpymaster /> :
            <InactiveSpymaster />}
        </Grid>
      </Grid>
    );
  }
}

SpymasterMain.propTypes = {
  ownTeam: PropTypes.string.isRequired,
  currentTeam: PropTypes.string.isRequired,
  listenOnCurrentTurn: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(SpymasterMain);
