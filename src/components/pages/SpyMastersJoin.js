import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import SendIcon from 'material-ui-icons/Send';

const mapState = null;
const mapDispatch = null;

class SpyMastersJoin extends React.Component {
  constructor() {
    super();
    this.state = {
      roomCodeInput: '',
    };
  }

  render() {
    return (
      <Grid
        container
        alignItems="center"
        justify="center"
        className="full-height"
      >
        <Grid item container justify="center">
          <Typography type="headline">Welcome, Spy Master</Typography>
          <Typography type="subheading">Please enter the four-digit room code below</Typography>
          <form noValidate autoComplete="off">
            <Grid container direction="column" alignItems="center">
              <Grid item>
                <TextField
                  required
                  label="Room Code (required)"
                  margin="normal"
                />
              </Grid>
              <Grid item>
                <Button raised color="primary">
                  Send
                  <SendIcon />
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    );
  }
}

SpyMastersJoin.propTypes = {};

export default connect(mapState, mapDispatch)(SpyMastersJoin);
