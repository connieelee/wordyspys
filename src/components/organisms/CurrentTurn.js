import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';
import Card, { CardContent } from 'material-ui/Card';

const mapState = state => ({
  team: state.currentTurn.team,
  clue: state.currentTurn.clue,
  number: state.currentTurn.number,
  turnIsOver: state.currentTurn.isOver,
});
const mapDispatch = null;

const CurrentTurn = ({ team, clue, number, turnIsOver }) => (
  <Card>
    <CardContent>
      <Typography type="headline" component="h2">CURRENT TURN</Typography>
      <div>
        <Typography component="p">TEAM: {team}</Typography>
        {(clue && number) ?
          <div>
            <Typography component="p">
              CLUE: <span className="code">{clue}</span> for <span className="code">{number}</span>
            </Typography>
            <Typography component="p">Click words to guess</Typography>
          </div> :
          <Typography component="p">WAITING ON SPYMASTER</Typography>}
        {turnIsOver && <Typography type="headline">YOUR TURN IS OVER</Typography>}
      </div>
    </CardContent>
  </Card>
);

CurrentTurn.propTypes = {
  team: PropTypes.string.isRequired,
  clue: PropTypes.string,
  number: PropTypes.number,
  turnIsOver: PropTypes.bool.isRequired,
};
CurrentTurn.defaultProps = {
  clue: null,
  number: null,
};

export default connect(mapState, mapDispatch)(CurrentTurn);
