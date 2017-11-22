import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router-dom';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import {
  RoomCodeForm,
  TeamPicker,
  KeyCardView,
} from '../organisms';

import { claimMaster } from '../../reducers/actionCreators';

const mapState = state => ({
  roomCode: state.roomCode,
});
const mapDispatch = dispatch => ({
  claimMaster: color => dispatch(claimMaster(color)),
});

class SpyMasters extends React.Component {
  constructor() {
    super();
    this.renderWithRedirect = this.renderWithRedirect.bind(this);
  }

  componentDidMount() {
    // set up listener for room disconnecting
    // set up handler for spymaster refreshing
  }

  componentWillUnmount() {
    // update db if a spymaster leaves
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
        <Grid item container justify="center">
          <Typography type="headline">Welcome, Spy Master</Typography>
          <Switch>
            <Route exact path="/masters" component={RoomCodeForm} />
            <Route path="/masters/team" render={this.renderWithRedirect(TeamPicker)} />
            <Route path="/masters/key" render={this.renderWithRedirect(KeyCardView)} />
          </Switch>
        </Grid>
      </Grid>
    );
  }
}

SpyMasters.propTypes = {
  roomCode: PropTypes.shape({
    value: PropTypes.arrayOf(PropTypes.strings),
  }).isRequired,
};

export default connect(mapState, mapDispatch)(SpyMasters);
