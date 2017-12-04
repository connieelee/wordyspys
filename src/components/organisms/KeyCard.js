import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Card from 'material-ui/Card';

const mapState = state => ({
  keys: state.keyCard.keys,
});
const mapDispatch = null;

const KeyCard = ({ keys, colors }) => (
  <div>
    {keys.map(row => (
      <Grid container>
        {row.map(key => (
          <Grid item className="cols-5">
            <Card className="key-card" style={{ backgroundColor: colors[key] }} />
          </Grid>
        ))}
      </Grid>
    ))}
  </div>
);

KeyCard.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  colors: PropTypes.shape({
    RED: PropTypes.string,
    BLUE: PropTypes.string,
    ASSASSIN: PropTypes.string,
    NEUTRAL: PropTypes.string,
  }),
};
KeyCard.defaultProps = {
  colors: {
    RED: '#F44336',
    BLUE: '#3F51B5',
    ASSASSIN: '#263238',
    NEUTRAL: '#FAFAFA',
  },
};

export default connect(mapState, mapDispatch)(KeyCard);
