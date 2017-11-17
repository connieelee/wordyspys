import React from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';

const Home = () => (
  <Grid
    container
    direction="column"
    alignItems="center"
    justify="center"
    className="full-height"
  >
    <Grid item>
      <Typography type="display3">WORDYSPYS</Typography>
    </Grid>
    <Grid item>
      <Button
        raised
        color="primary"
        component={Link}
        to="/local"
        className="side-margins-small"
      >Play Locally</Button>
      <Button
        raised
        disabled
        component={Link}
        to="/"
        className="side-margins-small"
      >Play Remotely</Button>
    </Grid>
  </Grid>
);

export default Home;
