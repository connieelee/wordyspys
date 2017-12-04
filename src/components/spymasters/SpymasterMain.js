import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { GiveClueForm, KeyCard } from './';

import { listenOnCurrentTurn } from '../../reducers/actionCreators';

const mapState = state => ({
  ownTeam: state.spymasters.ownTeam,
  currentTeam: state.currentTurn.team,
  clue: state.currentTurn.clue,
  number: state.currentTurn.number,
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
    const { ownTeam, currentTeam, clue, number } = this.props;
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
          {currentTeam === ownTeam ? (
            (clue && number) ?
              <Typography align="center">YOUR CLUE: {clue} for {number}</Typography> :
              <GiveClueForm />
          ) : <Typography align="center">Wait for your turn!</Typography>}
        </Grid>
      </Grid>
    );
  }
}

SpymasterMain.propTypes = {
  ownTeam: PropTypes.string.isRequired,
  currentTeam: PropTypes.string.isRequired,
  clue: PropTypes.string,
  number: PropTypes.number,
  listenOnCurrentTurn: PropTypes.func.isRequired,
};
SpymasterMain.defaultProps = {
  clue: '',
  number: null,
};

export default connect(mapState, mapDispatch)(SpymasterMain);
