import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { KeyCardView } from './';
import {
  TeamPicker,
  RoomCodeForm,
} from '../organisms';

import {
  claimMaster,
  disconnectMaster,
} from '../../reducers/actionCreators';

const mapState = state => ({
  roomCode: state.roomCode,
});
const mapDispatch = dispatch => ({
  claimMaster: color => dispatch(claimMaster(color)),
  disconnect: () => dispatch(disconnectMaster()),
});

class SpyMasters extends React.Component {
  constructor() {
    super();
    this.renderWithRedirect = this.renderWithRedirect.bind(this);
  }

  componentDidMount() {
    // TODO: set up listener for room disconnecting
    window.addEventListener('beforeunload', this.props.disconnect);
  }

  componentWillUnmount() {
    this.props.disconnect();
    window.removeEventListener('beforeunload', this.props.disconnect);
  }

  renderWithRedirect(Component) {
    return props => {
      if (!this.props.roomCode.value) return <Redirect to="/masters" />;
      return <Component {...props} />;
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
        <Grid
          item
          container
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Typography type="headline">Welcome, Spy Master</Typography>
          <Switch>
            <Route path="/masters/team" render={this.renderWithRedirect(TeamPicker)} />
            <Route path="/masters/key" render={this.renderWithRedirect(KeyCardView)} />
            <Route path="/masters" component={RoomCodeForm} />
          </Switch>
        </Grid>
      </Grid>
    );
  }
}

SpyMasters.propTypes = {
  roomCode: PropTypes.shape({
    value: PropTypes.string,
    error: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  disconnect: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(SpyMasters);
