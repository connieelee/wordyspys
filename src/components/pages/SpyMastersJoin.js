import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import RoomCodeForm from '../organisms/RoomCodeForm';
import TeamPicker from '../organisms/TeamPicker';

const mapState = null;
const mapDispatch = null;

class SpyMastersJoin extends React.Component {
  componentDidMount() {
    // set up listener for disconnecting
  }

  componentWillUnmount() {
    // update db if a spymaster leaves
  }

  render() {
    return (
      <Grid
        container
        alignItems="center"
        justify="center"
        className="full-height"
      >
        <Grid item container justify="center">
          <Typography type="headline">Welcome, Spy Master</Typography>
          <Switch>
            <Route exact path="/masters" component={RoomCodeForm} />
            <Route path="/masters/team" component={TeamPicker} />
          </Switch>
        </Grid>
      </Grid>
    );
  }
}

export default connect(mapState, mapDispatch)(SpyMastersJoin);
