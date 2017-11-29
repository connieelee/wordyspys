import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Card from 'material-ui/Card';
import Typography from 'material-ui/Typography';

const mapState = state => ({
  keys: state.keyCard.keys,
  startingTeam: state.keyCard.startingTeam,
});
const mapDispatch = null;

const KeyCard = ({ keys, startingTeam }) => (
  <div>
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
  </div>
);

KeyCard.propTypes = {
  startingTeam: PropTypes.string.isRequired,
  keys: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
};

export default connect(mapState, mapDispatch)(KeyCard);
