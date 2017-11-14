import React from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

const mapState = null;
const mapDispatch = null;

class AppContainer extends React.Component {
  componentDidMount() {
    firebase.initializeApp({
      apiKey: 'AIzaSyDtFAAyGdTeX0KqlhNc0wR61BVUa7_SXx0',
      authDomain: 'secret-titles.firebaseapp.com',
      databaseURL: 'https://secret-titles.firebaseio.com',
      projectId: 'secret-titles',
      storageBucket: 'secret-titles.appspot.com',
      messagingSenderId: '799476132267',
    });
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
