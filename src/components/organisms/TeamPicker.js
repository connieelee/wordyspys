import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const mapState = state => ({
  roomCode: state.roomCode,
});
const mapDispatch = null;

class TeamPicker extends React.Component {
  componentDidMount() {
    // subscribe to spymasters from db as to update availabilities
  }

  componentWillUnmount() {
    // unsubscribe from spymasters object
  }

  render() {
    if (!this.props.roomCode.value) return <Redirect to="/masters" />;
    return (
      <div>
        <Typography type="subheading" align="center">Select Your Team</Typography>
        <Button raised color="primary">BLUE</Button>
        <Button raised color="accent">RED</Button>
      </div>
    );
  }
}

TeamPicker.propTypes = {
  roomCode: PropTypes.shape({
    value: PropTypes.string,
    errors: PropTypes.arrayOf(PropTypes.string),
  }),
};
TeamPicker.defaultProps = {
  roomCode: {
    value: '',
    errors: [],
  },
};

export default connect(mapState, mapDispatch)(TeamPicker);
