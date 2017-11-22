import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';

const mapState = state => ({
  roomCode: state.roomCode,
  redTaken: state.spymasters.taken.RED,
  blueTaken: state.spymasters.taken.BLUE,
});
const mapDispatch = null;

const CurrentAction = ({ roomCode, redTaken, blueTaken }) => (
  <Card>
    <CardContent>
      <Typography type="body1">
        CURRENT ACTION
      </Typography>
      <Typography type="headline" component="h2">
        SPY MASTERS ONLY
      </Typography>
      <Typography component="p">
        To access the key card, visit wordyspys.firebaseapp.com/masters
        on a mobile device and enter the code
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '1.5rem',
            padding: '0 0.5rem',
          }}
        >{roomCode.value}</span>
      </Typography>
      {!redTaken && <Typography component="p">waiting on red team master</Typography>}
      {!blueTaken && <Typography component="p">waiting on blue team master</Typography>}
    </CardContent>
    <CardActions>
      <Button dense raised disabled={!redTaken && !blueTaken}>Continue</Button>
    </CardActions>
  </Card>
);

CurrentAction.propTypes = {
  roomCode: PropTypes.shape({
    value: PropTypes.string.isRequired,
    errors: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default connect(mapState, mapDispatch)(CurrentAction);
