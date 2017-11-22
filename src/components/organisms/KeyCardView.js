import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapState = state => ({
  ownTeam: state.spymasters.ownTeam,
});
const mapDispatch = null;

const KeyCardView = ({ ownTeam }) => (
  <div>you are on the {ownTeam} team!</div>
);

KeyCardView.propTypes = {
  ownTeam: PropTypes.string.isRequired,
};

export default connect(mapState, mapDispatch)(KeyCardView);
