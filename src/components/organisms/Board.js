import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Card from 'material-ui/Card';

import { makeBoard } from '../../reducers/actionCreators';

const mapState = state => ({
  board: state.board,
});
const mapDispatch = dispatch => ({
  getBoard() { dispatch(makeBoard()); },
});

class Board extends React.Component {
  componentDidMount() {
    this.props.getBoard();
  }

  render() {
    return (
      <div>
        {this.props.board.map(row => (
          <Grid container>
            {row.map(card => (
              <Grid key={card.word} item className="cols-5">
                <Card className="word-card">
                  <Typography type="title">{card.word}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        ))}
      </div>
    );
  }
}

Board.propTypes = {
  board: PropTypes.arrayOf(PropTypes.array).isRequired,
  getBoard: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(Board);
