import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';
import Card, { CardContent } from 'material-ui/Card';

const mapState = state => ({
  winner: state.gameOver.winner,
});
const mapDispatch = null;

const GameOver = ({ winner }) => (
  <Card className="panel-card">
    <CardContent>
      <Typography type="headline" component="h2">THE GAME IS OVER!</Typography>
      <Typography type="headline">
        {winner} TEAM WON!
        <span role="img" aria-label="yay!">🎉</span>
      </Typography>
    </CardContent>
  </Card>
);

GameOver.propTypes = {
  winner: PropTypes.string.isRequired,
};

export default connect(mapState, mapDispatch)(GameOver);
