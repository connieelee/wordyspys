import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { SpymasterMain } from './';
import {
  TeamPicker,
  RoomCodeForm,
} from '../organisms';

import {
  claimMaster,
  disconnectMaster,
  onRoomDisconnect,
} from '../../reducers/actionCreators';

const mapState = state => ({
  roomCode: state.roomCode,
});
const mapDispatch = dispatch => ({
  claimMaster: color => dispatch(claimMaster(color)),
  disconnect: () => dispatch(disconnectMaster()),
  onRoomDisconnect: callback => dispatch(onRoomDisconnect(callback)),
});

class SpymasterRouter extends React.Component {
  constructor() {
    super();
    this.renderWithRedirect = this.renderWithRedirect.bind(this);
    this.attachRoomListener = this.attachRoomListener.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', () => {
      this.props.disconnect();
    });
  }

  componentWillUnmount() {
    this.props.disconnect();
  }

  attachRoomListener() {
    this.props.onRoomDisconnect(() => {
      this.props.history.push('/masters');
    });
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
          <Typography type="headline">HEY, SPY MASTER!</Typography>
          <Switch>
            <Route path="/masters/team" render={this.renderWithRedirect(TeamPicker)} />
            <Route path="/masters/key" render={this.renderWithRedirect(SpymasterMain)} />
            <Route
              path="/masters"
              render={props => (
                <RoomCodeForm attachRoomListener={this.attachRoomListener} {...props} />
              )}
            />
          </Switch>
        </Grid>
      </Grid>
    );
  }
}

SpymasterRouter.propTypes = {
  roomCode: PropTypes.shape({
    value: PropTypes.string,
    error: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  disconnect: PropTypes.func.isRequired,
  onRoomDisconnect: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default connect(mapState, mapDispatch)(SpymasterRouter);
