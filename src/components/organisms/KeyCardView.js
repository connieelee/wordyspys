import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapState = state => ({
  teamColor: state.spymasters.ownTeam,
});
const mapDispatch = null;

const KeyCardView = ({ teamColor }) => (
  <div>you are on the {teamColor} team!</div>
);

KeyCardView.propTypes = {
  teamColor: PropTypes.string.isRequired,
};

export default connect(mapState, mapDispatch)(KeyCardView);
