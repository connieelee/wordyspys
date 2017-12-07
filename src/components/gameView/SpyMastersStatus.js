import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';
import Card, { CardContent } from 'material-ui/Card';

const styles = {
  title: {
    fontFamily: 'Space Mono',
    padding: '1vh 0',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: '1vh 5vw',
  },
  largerFont: {
    fontSize: '1rem',
  },
  padBottom: {
    paddingBottom: '3vh',
  },
  redText: {
    color: '#F44336',
  },
  blueText: {
    color: '#3F51B5',
  },
  teamText: {
    fontFamily: 'Space Mono',
    fontWeight: 'bold',
  },
};

const mapState = state => ({
  roomCode: state.roomCode,
  redTaken: state.spymasters.taken.RED,
  blueTaken: state.spymasters.taken.BLUE,
});
const mapDispatch = null;

const SpyMastersStatus = ({ roomCode, redTaken, blueTaken }) => (
  <Card className="panel-card">
    <CardContent className="text-center">
      <Typography type="headline" component="h2" style={styles.title}>
        SPY MASTERS STATUS
      </Typography>
      <div style={styles.contentContainer}>
        {(!redTaken || !blueTaken) &&
        <Typography component="p" style={Object.assign({}, styles.largerFont, styles.padBottom)}>
          Join as a spymaster at
          <span className="code"> wordyspys.firebaseapp.com </span>
          with the code
          <span className="code"> {roomCode.value}</span>
        </Typography>}
        <Typography component="p" style={styles.largerFont}>
          <span style={Object.assign({}, styles.redText, styles.teamText)}>RED TEAM:</span>
          {redTaken ? ' Joined!' : ' Pending'}
        </Typography>
        <Typography component="p" style={styles.largerFont}>
          <span style={Object.assign({}, styles.blueText, styles.teamText)}>BLUE TEAM:</span>
          {blueTaken ? ' Joined!' : ' Pending'}
        </Typography>
      </div>
    </CardContent>
  </Card>
);

SpyMastersStatus.propTypes = {
  roomCode: PropTypes.shape({
    value: PropTypes.string.isRequired,
    errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  redTaken: PropTypes.bool.isRequired,
  blueTaken: PropTypes.bool.isRequired,
};

export default connect(mapState, mapDispatch)(SpyMastersStatus);
