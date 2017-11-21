import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

// import { validateRoomCode } from '../../reducers/actionCreators';

const mapState = null;
const mapDispatch = null;

class TeamPicker extends React.Component {
  componentDidMount() {
    // subscribe to spymasters from db as to update availabilities
  }

  componentWillUnmount() {
    // unsubscribe from spymasters object
  }

  render() {
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
  // next: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(TeamPicker);
