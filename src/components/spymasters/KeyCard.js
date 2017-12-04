import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Card from 'material-ui/Card';
import Typography from 'material-ui/Typography';

const mapState = state => ({
  keys: state.keyCard.keys,
  revealed: state.board.map(row => row.map(card => {
    if (card.status !== 'UNTOUCHED') return true;
    return false;
  })),
});
const mapDispatch = null;

const KeyCard = ({ keys, revealed, colors }) => (
  <div>
    {keys.map((row, rowId) => (
      <Grid container>
        {row.map((key, colId) => (
          <Grid item className="cols-5">
            <Card className="key-card" style={{ backgroundColor: colors[key] }}>
              <Typography display="headline" align="center" style={{ fontSize: '2rem', color: 'white' }}>
                {revealed[rowId][colId] && 'X'}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    ))}
  </div>
);

KeyCard.propTypes = {
  keys: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  revealed: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.bool)).isRequired,
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
