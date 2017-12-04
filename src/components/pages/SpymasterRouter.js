import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import Grid from 'material-ui/Grid';
import { SpymasterMain } from './';
import {
  TeamPicker,
  RoomCodeForm,
} from '../organisms';

import {
  claimMaster,
  listenOnBoard,
  onRoomDisconnect,
  disconnectMaster,
} from '../../reducers/actionCreators';

const mapState = state => ({
  roomCode: state.roomCode,
});
const mapDispatch = dispatch => {
  let removeBoardListener;
  let removeRoomListener;
  return {
    claimMaster: color => dispatch(claimMaster(color)),
    listenOnBoard: () => {
      removeBoardListener = dispatch(listenOnBoard());
    },
    onRoomDisconnect: callback => {
      removeRoomListener = dispatch(onRoomDisconnect(callback));
    },
    disconnect: () => {
      dispatch(disconnectMaster());
      removeBoardListener();
      removeRoomListener();
    },
  };
};

class SpymasterRouter extends React.Component {
  constructor() {
    super();
    this.renderWithRedirect = this.renderWithRedirect.bind(this);
    this.attachListeners = this.attachListeners.bind(this);
  }

  componentDidMount() {
    window.addEventListener('beforeunload', () => {
      this.props.disconnect();
    });
  }

  componentWillUnmount() {
    this.props.disconnect();
  }

  attachListeners() {
    this.props.listenOnBoard();
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
          <Switch>
            <Route path="/masters/team" render={this.renderWithRedirect(TeamPicker)} />
            <Route path="/masters/key" render={this.renderWithRedirect(SpymasterMain)} />
            <Route
              path="/masters"
              render={props => (
                <RoomCodeForm attachListeners={this.attachListeners} {...props} />
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
  onRoomDisconnect: PropTypes.func.isRequired,
  listenOnBoard: PropTypes.func.isRequired,
  disconnect: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default connect(mapState, mapDispatch)(SpymasterRouter);
