import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import {
  listenOnSpymasters,
  claimMaster,
} from '../../reducers/actionCreators';

const mapState = state => ({
  roomCode: state.roomCode,
  taken: state.spymasters.taken,
});
const mapDispatch = dispatch => ({
  listenForUpdates: () => dispatch(listenOnSpymasters()),
  claimMaster: color => dispatch(claimMaster(color)),
});

class TeamPicker extends React.Component {
  constructor() {
    super();
    this.select = this.select.bind(this);
    this.claimAndRedirect = this.claimAndRedirect.bind(this);
  }

  componentDidMount() {
    if (this.props.roomCode.value) {
      this.stopListening = this.props.listenForUpdates();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.taken.RED) this.claimAndRedirect('BLUE');
    else if (nextProps.taken.BLUE) this.claimAndRedirect('RED');
  }

  componentWillUnmount() {
    if (this.stopListening) this.stopListening();
  }

  claimAndRedirect(color) {
    this.props.claimMaster(color);
    this.props.history.push('/masters/key');
  }

  select(e) {
    this.claimAndRedirect(e.target.innerText);
  }

  render() {
    if (!this.props.roomCode.value) return <Redirect to="/masters" />;
    return (
      <div>
        <Typography type="subheading" align="center">Select Your Team</Typography>
        <Button raised color="primary" onClick={this.select}>BLUE</Button>
        <Button raised color="accent" onClick={this.select}>RED</Button>
      </div>
    );
  }
}

TeamPicker.propTypes = {
  roomCode: PropTypes.shape({
    value: PropTypes.string,
    errors: PropTypes.arrayOf(PropTypes.string),
  }),
  taken: PropTypes.shape({
    RED: PropTypes.boolean,
    BLUE: PropTypes.boolean,
  }).isRequired,
  listenForUpdates: PropTypes.func.isRequired,
  claimMaster: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};
TeamPicker.defaultProps = {
  roomCode: {
    value: '',
    errors: [],
  },
};

export default connect(mapState, mapDispatch)(TeamPicker);
