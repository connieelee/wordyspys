import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';
import Card, { CardContent } from 'material-ui/Card';

const mapState = state => ({
  roomCode: state.roomCode,
  redTaken: state.spymasters.taken.RED,
  blueTaken: state.spymasters.taken.BLUE,
});
const mapDispatch = null;

const SpyMastersStatus = ({ roomCode, redTaken, blueTaken }) => (
  <Card className="panel-card">
    <CardContent>
      <Typography type="headline" component="h2">
        SPY MASTERS STATUS
      </Typography>
      <div>
        {(!redTaken || !blueTaken) &&
        <Typography component="p">
          To access the key card, visit wordyspys.firebaseapp.com/masters
          on a mobile device and enter the code
          <span className="code"> {roomCode.value}</span>
        </Typography>}
        <Typography component="p">
          RED TEAM: {redTaken ? 'Joined!' : 'Waiting for a spy master'}
        </Typography>
        <Typography component="p">
          BLUE TEAM: {blueTaken ? 'Joined!' : 'Waiting for a spy master'}
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
