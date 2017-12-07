import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

const styles = {
  title: {
    fontFamily: 'Space Mono',
    padding: '1vh 0',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: '5vh 5vw',
    textAlign: 'center',
  },
  padBottom: {
    paddingBottom: '3vh',
  },
};

const mapState = state => ({
  winner: state.gameOver.winner,
});
const mapDispatch = null;

const GameOver = ({ winner }) => (
  <Card className="panel-card">
    <CardContent style={styles.contentContainer}>
      <Typography type="headline" style={styles.title}>GAME OVER</Typography>
      <Typography type="title" style={Object.assign({}, styles.title, styles.padBottom)}>
        {winner} TEAM WON!
        <span role="img" aria-label="yay!"> 🎉 </span>
      </Typography>
      <Button color="primary" raised onClick={() => window.location.reload()}>NEW GAME</Button>
    </CardContent>
  </Card>
);

GameOver.propTypes = {
  winner: PropTypes.string.isRequired,
};

export default connect(mapState, mapDispatch)(GameOver);
