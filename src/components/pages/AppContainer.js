import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import initializeFirebaseApp from '../../firebase/initialize';

const mapState = null;
const mapDispatch = null;

class AppContainer extends React.Component {
  componentDidMount() {
    initializeFirebaseApp();
  }

  render() {
    return (
      <div>
        <h1>APP CONTAINER</h1>
        {this.props.location.pathname === '/' && <Redirect to="/home" />}
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(AppContainer);
