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
});
const mapDispatch = dispatch => ({
  listenOnCurrentTurn: () => dispatch(listenOnCurrentTurn()),
});

class KeyCardView extends React.Component {
  componentDidMount() {
    this.stopListening = this.props.listenOnCurrentTurn();
  }

  componentWillUnmount() {
    this.stopListening();
  }

  render() {
    const { ownTeam, currentTeam, startingTeam, keys } = this.props;
    return (
      <div>
        <Typography align="center">you are on the {ownTeam} team!</Typography>
        <Typography align="center">the starting team is {startingTeam}!</Typography>
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
        {currentTeam === ownTeam ? <GiveClueForm /> : <p>wait for your turn</p>}
      </div>
    );
  }
}

KeyCardView.propTypes = {
  ownTeam: PropTypes.string.isRequired,
  currentTeam: PropTypes.string.isRequired,
  startingTeam: PropTypes.string.isRequired,
  keys: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  listenOnCurrentTurn: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(KeyCardView);
