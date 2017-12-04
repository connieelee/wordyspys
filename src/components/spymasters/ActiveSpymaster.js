import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';
import { GiveClueForm } from './';

const mapState = state => ({
  clue: state.currentTurn.clue,
  number: state.currentTurn.number,
});
const mapDispatch = null;

const ActiveSpymaster = ({ clue, number }) => (
  <div>
    {clue && number ?
      <Typography align="center">YOUR CLUE: {clue} for {number}</Typography> :
      <GiveClueForm />}
  </div>
);

ActiveSpymaster.propTypes = {
  clue: PropTypes.string,
  number: PropTypes.number,
};
ActiveSpymaster.defaultProps = {
  clue: '',
  number: null,
};

export default connect(mapState, mapDispatch)(ActiveSpymaster);
