import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Card from 'material-ui/Card';

import { makeGuess } from '../../reducers/actionCreators';

const mapState = state => ({
  board: state.board,
});
const mapDispatch = dispatch => ({
  selectCard: (word, rowId, colId) => dispatch(makeGuess(word, rowId, colId)),
});

const Board = ({ board, selectCard, colors }) => (
  <div id="board">
    {board.map((row, rowId) => (
      <Grid container>
        {row.map((card, colId) => (
          <Grid key={card.word} item className="cols-5">
            <Card
              onClick={card.status === 'UNTOUCHED' ? () => selectCard(card.word, rowId, colId) : null}
              className="word-card"
              style={{ backgroundColor: colors[card.status] }}
            >
              <Typography type="title">{card.word}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    ))}
  </div>
);

Board.propTypes = {
  board: PropTypes.arrayOf(PropTypes.array).isRequired,
  selectCard: PropTypes.func.isRequired,
  colors: PropTypes.shape({
    RED: PropTypes.string,
    BLUE: PropTypes.string,
    ASSASSIN: PropTypes.string,
    NEUTRAL: PropTypes.string,
  }),
};
Board.defaultProps = {
  colors: {
    RED: '#F44336',
    BLUE: '#3F51B5',
    ASSASSIN: '#263238',
    NEUTRAL: '#BDBDBD',
  },
};

export default connect(mapState, mapDispatch)(Board);
