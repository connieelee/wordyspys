import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

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
      <Button raised onClick={() => window.location.reload()}>NEW GAME</Button>
    </CardContent>
  </Card>
);

GameOver.propTypes = {
  winner: PropTypes.string.isRequired,
};

export default connect(mapState, mapDispatch)(GameOver);
