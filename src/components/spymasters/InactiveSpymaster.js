import React from 'react';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';

const mapState = null;
const mapDispatch = null;

const InactiveSpymaster = () => (
  <div>
    <Typography align="center">Wait for your turn!</Typography>
  </div>
);

export default connect(mapState, mapDispatch)(InactiveSpymaster);
