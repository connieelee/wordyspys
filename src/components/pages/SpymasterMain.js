import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Typography from 'material-ui/Typography';
import { GiveClueForm, KeyCard } from '../organisms';

import { listenOnCurrentTurn } from '../../reducers/actionCreators';

const mapState = state => ({
  ownTeam: state.spymasters.ownTeam,
  currentTeam: state.currentTurn.team,
  clue: state.currentTurn.clue,
  number: state.currentTurn.number,
});
const mapDispatch = dispatch => ({
  listenOnCurrentTurn: () => dispatch(listenOnCurrentTurn()),
});

class SpymasterMain extends React.Component {
  componentDidMount() {
    this.stopListening = this.props.listenOnCurrentTurn();
  }

  componentWillUnmount() {
    this.stopListening();
  }

  render() {
    const { ownTeam, currentTeam, clue, number } = this.props;
    return (
      <div>
        <Typography align="center">YOUR TEAM: {ownTeam}</Typography>
        <KeyCard />
        {((currentTeam === ownTeam) && (clue && number)) &&
        <Typography>YOUR CLUE: {clue} for {number}</Typography>}
        {((currentTeam === ownTeam) && !(clue && number)) && <GiveClueForm />}
        {(currentTeam !== ownTeam) && <Typography>wait for your turn</Typography>}
      </div>
    );
  }
}

SpymasterMain.propTypes = {
  ownTeam: PropTypes.string.isRequired,
  currentTeam: PropTypes.string.isRequired,
  clue: PropTypes.string,
  number: PropTypes.number,
  listenOnCurrentTurn: PropTypes.func.isRequired,
};
SpymasterMain.defaultProps = {
  clue: '',
  number: null,
};

export default connect(mapState, mapDispatch)(SpymasterMain);
