import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';
import Card, { CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';

import { endTurn } from '../../reducers/actionCreators';

const styles = {
  title: {
    fontFamily: 'Space Mono',
    padding: '1vh 0',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: '1vh 5vw',
  },
  largerFont: {
    fontSize: '1rem',
  },
  padBottom: {
    paddingBottom: '3vh',
  },
  redText: {
    color: '#F44336',
  },
  blueText: {
    color: '#3F51B5',
  },
  teamText: {
    fontFamily: 'Space Mono',
    fontWeight: 'bold',
  },
};

const mapState = state => ({
  team: state.currentTurn.team,
  clue: state.currentTurn.clue,
  number: state.currentTurn.number,
  turnIsOver: state.currentTurn.isOver,
});
const mapDispatch = dispatch => ({
  end: () => dispatch(endTurn()),
});

const CurrentTurn = ({ team, clue, number, turnIsOver, end }) => (
  <Card className="panel-card">
    <CardContent className="text-center">
      <Typography type="headline" component="h2" style={styles.title}>CURRENT TURN</Typography>
      <div style={styles.contentContainer}>
        <Typography component="p" style={styles.largerFont}>TEAM:
          <span style={styles.teamText}> {team} </span>
        </Typography>
        <Typography component="p" style={Object.assign({}, styles.largerFont, styles.padBottom)}>
          {(clue && number) ?
            <span>
              CLUE:
              <span className="code"> {clue} </span>
              for
              <span className="code"> {number} </span>
            </span> :
            'WAITING ON SPYMASTER'}
        </Typography>
        {turnIsOver ?
          <div>
            <Typography component="p" style={styles.largerFont}>
              YOUR TURN IS OVER
            </Typography>
            <Button raised onClick={end}>OK</Button>
          </div> :
          <Button raised onClick={end}>PASS</Button>}
      </div>
    </CardContent>
  </Card>
);

CurrentTurn.propTypes = {
  team: PropTypes.string.isRequired,
  clue: PropTypes.string,
  number: PropTypes.number,
  turnIsOver: PropTypes.bool.isRequired,
  end: PropTypes.func.isRequired,
};
CurrentTurn.defaultProps = {
  clue: null,
  number: null,
};

export default connect(mapState, mapDispatch)(CurrentTurn);
