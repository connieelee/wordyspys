import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import SendIcon from 'material-ui-icons/Send';
import Typography from 'material-ui/Typography';

import { giveClue } from '../../reducers/actionCreators';

const mapState = null;
const mapDispatch = dispatch => ({
  giveClue: (clue, number) => dispatch(giveClue(clue, number)),
});

class GiveClueForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clue: { value: '', isValid: false, errors: [] },
      number: { value: null, isValue: false, errors: [] },
    };
    this.updateInputValue = this.updateInputValue.bind(this);
    this.submit = this.submit.bind(this);
  }

  updateInputValue(e) {
    const { name: field, value } = e.target;
    let isValid;
    const errors = [];
    if (field === 'clue') {
      isValid = /^[a-zA-Z]+$/.test(value);
      if (!isValid) errors.push('Clue must be one word with only alphabet characters');
    }
    if (field === 'number') {
      isValid = /^\d+$/.test(value);
      if (!isValid) errors.push('Number must be a positive integer');
    }
    this.setState({
      [field]: {
        value,
        isValid,
        errors,
      },
    });
  }

  submit(e) {
    e.preventDefault();
    this.props.giveClue(this.state.clue.value, +this.state.number.value);
  }

  render() {
    return (
      <form noValidate autoComplete="off" onSubmit={this.submit}>
        <Grid container direction="column" alignItems="center">
          <Grid item>
            <TextField
              required
              type="text"
              name="clue"
              onChange={this.updateInputValue}
              label="Clue (required)"
              margin="normal"
            />
            {!!this.state.clue.errors.length && this.state.clue.errors.map(err => (
              <Grid item key="err">
                <Typography color="accent">{err}</Typography>
              </Grid>
            ))}
          </Grid>
          <Grid item>
            <TextField
              required
              type="number"
              name="number"
              onChange={this.updateInputValue}
              label="Number (required)"
              margin="normal"
            />
            {!!this.state.number.errors.length && this.state.number.errors.map(err => (
              <Grid item key="err">
                <Typography color="accent">{err}</Typography>
              </Grid>
            ))}
          </Grid>
          <Grid item>
            <Button
              raised
              type="submit"
              color="primary"
              disabled={!this.state.clue.isValid || !this.state.number.isValid}
            >
              Submit
              <SendIcon />
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}

GiveClueForm.propTypes = {
  giveClue: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(GiveClueForm);
