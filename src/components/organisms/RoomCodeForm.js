import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import SendIcon from 'material-ui-icons/Send';
import Typography from 'material-ui/Typography';

import {
  validateCode,
  setCode,
  readKeyCard,
} from '../../reducers/actionCreators';

const mapState = state => ({
  errors: state.roomCode.errors,
});
const mapDispatch = dispatch => ({
  validateCode: code => dispatch(validateCode(code)),
  populateState: code => {
    dispatch(setCode(code));
    return dispatch(readKeyCard());
  },
});

class RoomCodeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', isValid: false };
    this.updateInputValue = this.updateInputValue.bind(this);
    this.submit = this.submit.bind(this);
  }

  updateInputValue(e) {
    this.setState({
      value: e.target.value,
      isValid: /^[a-zA-Z0-9]{4}$/.test(e.target.value),
    });
  }

  submit(e) {
    e.preventDefault();
    const code = this.state.value;
    this.props.validateCode(code)
    .then(error => {
      if (!error) {
        this.props.populateState(code);
        this.props.history.push('/masters/team');
      }
    });
  }

  render() {
    return (
      <div>
        <Typography type="subheading">Please enter the four-digit room code below</Typography>
        <form noValidate autoComplete="off" onSubmit={this.submit}>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <TextField
                required
                onChange={this.updateInputValue}
                label="Room Code (required)"
                margin="normal"
              />
              {!!this.props.errors.length && this.props.errors.map(err => (
                <Typography color="accent">{err}</Typography>
              ))}
            </Grid>
            <Grid item>
              <Button
                raised
                type="submit"
                color="primary"
                disabled={!this.state.isValid}
              >
                Next
                <SendIcon />
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

RoomCodeForm.propTypes = {
  validateCode: PropTypes.func.isRequired,
  populateState: PropTypes.func.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  errors: PropTypes.arrayOf(PropTypes.string),
};
RoomCodeForm.defaultProps = {
  errors: [],
};

export default connect(mapState, mapDispatch)(RoomCodeForm);
