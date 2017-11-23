import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';
import Card, { CardContent } from 'material-ui/Card';

const mapState = state => ({
  team: state.currentMove.team,
  clue: state.currentMove.clue,
  number: state.currentMove.number,
});
const mapDispatch = null;

const CurrentMove = ({ team, clue, number }) => (
  <Card>
    <CardContent>
      <Typography type="headline" component="h2">CURRENT MOVE</Typography>
      <div>
        <Typography component="p">TEAM: {team}</Typography>
        {(clue && number) ?
          <Typography component="p">
            CLUE: <span className="code">{clue}</span> for <span className="code">{number}</span>
          </Typography> :
          <Typography>WAITING ON SPYMASTER</Typography>}
      </div>
    </CardContent>
  </Card>
);

CurrentMove.propTypes = {
  team: PropTypes.string.isRequired,
  clue: PropTypes.string,
  number: PropTypes.string,
};
CurrentMove.defaultProps = {
  clue: null,
  number: null,
};

export default connect(mapState, mapDispatch)(CurrentMove);
