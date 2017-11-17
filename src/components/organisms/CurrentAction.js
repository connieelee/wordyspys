import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';

const mapState = state => ({
  roomCode: state.roomCode,
});
const mapDispatch = null;

const CurrentAction = ({ roomCode }) => (
  <Card>
    <CardContent>
      <Typography type="body1">
        CURRENT ACTION
      </Typography>
      <Typography type="headline" component="h2">
        Spy Masters need key card
      </Typography>
      <Typography component="p">
        SPY MASTERS ONLY: To access the key card, visit wordyspys.firebaseapp.com/keys
        on a mobile device and enter the code displayed below
      </Typography>
      <Typography
        type="display3"
        color="accent"
        align="center"
        style={{ fontFamily: 'monospace' }}
      >{roomCode}
      </Typography>
    </CardContent>
    <CardActions>
      <Button dense>Done</Button>
    </CardActions>
  </Card>
);

CurrentAction.propTypes = {
  roomCode: PropTypes.string.isRequired,
};

export default connect(mapState, mapDispatch)(CurrentAction);
