import React from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Card from 'material-ui/Card';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getBoard } from '../reducers/board';

const mapState = state => ({
  board: state.board,
});
const mapDispatch = dispatch => ({
  setUpLocalGame() {
    dispatch(getBoard());
  },
});

class LocalGame extends React.Component {
  componentDidMount() {
    this.props.setUpLocalGame();
  }

  render() {
    return (
      <Grid container>
        <Grid item container lg="8">
          {this.props.board.map(row => (
            <Grid item container>
              {row.map(card => (
                <Grid key={card.word} item className="cols-5">
                  <Card className="word-card">
                    <Typography type="title">{card.word}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ))}
          <Grid item style={{ marginLeft: 'auto' }}>
            <Typography type="display3" align="center">SECRET TITLES</Typography>
          </Grid>
        </Grid>
        <Grid item lg="4">
          actions and stuff goes here
        </Grid>
      </Grid>
    );
  }
}

LocalGame.propTypes = {
  board: PropTypes.arrayOf(PropTypes.array).isRequired,
  setUpLocalGame: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(LocalGame);
