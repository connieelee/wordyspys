import React from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';

const styles = {
  background: {
    backgroundColor: 'black',
    margin: 0,
  },
  logo: {
    border: '2px solid green',
    padding: '1rem 2rem',
    marginBottom: '1rem',
    fontFamily: 'Space Mono',
    fontSize: '4rem',
    color: 'white',
    opacity: 0,
    transition: 'opacity 2s',
  },
  logoActive: {
    opacity: 1,
  },
  buttons: {
    display: 'flex',
    textAlign: 'center',
    opacity: 0,
    transform: 'translateY(-1.5vh)',
    transition: 'all 2s',
  },
  buttonsActive: {
    opacity: 1,
    transform: 'translateY(0)',
  },
  startBtn: {
    margin: '0 1rem',
    backgroundColor: 'green',
    color: 'white',
  },
};

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      logoStyle: styles.logo,
      buttonsStyle: styles.buttons,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        logoStyle: Object.assign(styles.logo, styles.logoActive),
        buttonsStyle: Object.assign(styles.buttons, styles.buttonsActive),
      });
    }, 500);
  }

  render() {
    return (
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        className="full-height"
        style={styles.background}
      >
        <Grid item>
          <Typography style={this.state.logoStyle}>
            - wordy spys -
          </Typography>
        </Grid>
        <Grid item style={this.state.buttonsStyle}>
          <Button
            raised
            component={Link}
            to="/local"
            style={styles.startBtn}
          >Start new game</Button>
          <Button
            raised
            component={Link}
            to="/masters"
          >Join as spymaster</Button>
        </Grid>
      </Grid>
    );
  }
}

export default Home;
