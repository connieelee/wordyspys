import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Card from 'material-ui/Card';

import { addGuess, revealCard } from '../../reducers/actionCreators';

const mapState = state => ({
  board: state.board,
});
const mapDispatch = dispatch => ({
  selectCard: (word, rowId, colId) => {
    dispatch(addGuess(word));
    dispatch(revealCard(rowId, colId));
  },
});

const Board = ({ board, selectCard }) => (
  <div>
    {board.map((row, rowId) => (
      <Grid container>
        {row.map((card, colId) => {
          let color;
          if (card.status === 'RED' || card.status === 'BLUE') color = card.status.toLowerCase();
          else if (card.status === 'ASSASSIN') color = 'black';
          else if (card.status === 'NEUTRAL') color = 'beige';
          else color = 'white';
          return (
            <Grid key={card.word} item className="cols-5">
              <Card
                onClick={() => selectCard(card.word, rowId, colId)}
                className="word-card"
                style={{ backgroundColor: color }}
              >
                <Typography type="title">{card.word}</Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    ))}
  </div>
);

Board.propTypes = {
  board: PropTypes.arrayOf(PropTypes.array).isRequired,
  selectCard: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(Board);
