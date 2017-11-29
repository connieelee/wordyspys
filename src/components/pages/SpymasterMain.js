import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Card from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import { GiveClueForm } from '../organisms';

import { listenOnCurrentTurn } from '../../reducers/actionCreators';

const mapState = state => ({
  ownTeam: state.spymasters.ownTeam,
  currentTeam: state.currentTurn.team,
  startingTeam: state.keyCard.startingTeam,
  keys: state.keyCard.keys,
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
    const { ownTeam, currentTeam, startingTeam, keys, clue, number } = this.props;
    return (
      <div>
        <Typography align="center">YOUR TEAM: {ownTeam}</Typography>
        {keys.map(row => (
          <Grid container>
            {row.map(key => {
              let color;
              if (key === 'RED' || key === 'BLUE') color = key.toLowerCase();
              else if (key === 'ASSASSIN') color = 'black';
              else color = 'lightgrey';
              return (
                <Grid item className="cols-5">
                  <Card className="key-card" style={{ background: color }} />
                </Grid>
              );
            })}
          </Grid>
        ))}
        <Typography align="center">the starting team is {startingTeam}!</Typography>
        {((currentTeam === ownTeam) && (clue && number)) &&
        <Typography>YOUR CLUE: {clue} for {number}</Typography>}
        {((currentTeam === ownTeam) && !(clue && number)) && <GiveClueForm />}
        {(currentTeam !== ownTeam) && <Typography>wait for your turn</Typography>}
      </div>
    );
  }
}

SpymasterMain.propTypes = {
  ownTeam: PropTypes.string.isRequired,
  currentTeam: PropTypes.string.isRequired,
  startingTeam: PropTypes.string.isRequired,
  keys: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  listenOnCurrentTurn: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(SpymasterMain);
