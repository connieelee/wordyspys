import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import {
  listenOnSpymasters,
  claimMaster,
} from '../../reducers/actionCreators';

const mapState = state => ({
  redTaken: state.spymasters.taken.RED,
  blueTaken: state.spymasters.taken.BLUE,
});
const mapDispatch = dispatch => ({
  listenForUpdates: () => dispatch(listenOnSpymasters()),
  claimMaster: color => dispatch(claimMaster(color)),
});

class TeamPicker extends React.Component {
  constructor() {
    super();
    this.select = this.select.bind(this);
  }

  componentDidMount() {
    this.stopListening = this.props.listenForUpdates();
  }

  componentWillUnmount() {
    if (this.stopListening) this.stopListening();
  }

  select(e) {
    this.props.claimMaster(e.target.innerText.trim());
    this.props.history.push('/masters/key');
  }

  render() {
    return (
      <Grid container direction="column">
        <Grid item>
          <Typography type="subheading" align="center">
            Select Your Team
          </Typography>
        </Grid>
        <Grid item style={{ margin: '0 auto' }}>
          <Button
            raised
            color="primary"
            onClick={this.select}
            disabled={this.props.blueTaken}
          >
            BLUE
          </Button>
        </Grid>
        <Grid item style={{ margin: '0 auto' }}>
          <Button
            raised
            color="accent"
            onClick={this.select}
            disabled={this.props.redTaken}
          >
            RED
          </Button>
        </Grid>
      </Grid>
    );
  }
}

TeamPicker.propTypes = {
  listenForUpdates: PropTypes.func.isRequired,
  claimMaster: PropTypes.func.isRequired,
  redTaken: PropTypes.bool.isRequired,
  blueTaken: PropTypes.bool.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};
TeamPicker.defaultProps = {
  roomCode: {
    value: '',
    errors: [],
  },
};

export default connect(mapState, mapDispatch)(TeamPicker);
