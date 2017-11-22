import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Card from 'material-ui/Card';
import Typography from 'material-ui/Typography';

const mapState = state => ({
  ownTeam: state.spymasters.ownTeam,
  startingTeam: state.keyCard.startingTeam,
  keys: state.keyCard.keys,
});
const mapDispatch = null;

const KeyCardView = ({ ownTeam, startingTeam, keys }) => (
  <div>
    <Typography align="center">you are on the {ownTeam} team!</Typography>
    <Typography align="center">the starting team is {startingTeam}!</Typography>
    {keys.map(row => (
      <Grid container>
        {row.map(key => {
          let color;
          if (key === 'RED') color = 'red';
          else if (key === 'BLUE') color = 'blue';
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
  </div>
);

KeyCardView.propTypes = {
  ownTeam: PropTypes.string.isRequired,
  startingTeam: PropTypes.string.isRequired,
  keys: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default connect(mapState, mapDispatch)(KeyCardView);
