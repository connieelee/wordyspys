import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getBoard } from '../../reducers/board';

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
      <div>
        <div>
          <div id="board">
            {
              this.props.board.map(row => (
                <div>
                  {row.map(card => <p>{card.word}</p>)}
                </div>
              ))
            }
          </div>
          <h1>SECRET TITLES</h1>
        </div>
        <sidebar id="history">
          <div>
            <h1>CURRENT ACTION</h1>
          </div>
          <div>
            <h1>PREVIOUS TURNS</h1>
          </div>
        </sidebar>
      </div>
    );
  }
}

LocalGame.propTypes = {
  board: PropTypes.arrayOf(PropTypes.array).isRequired,
  setUpLocalGame: PropTypes.func.isRequired,
};

export default connect(mapState, mapDispatch)(LocalGame);
