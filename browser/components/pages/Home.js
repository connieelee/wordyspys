import React from 'react';
import { connect } from 'react-redux';

const mapState = null;
const mapDispatch = null;

class Home extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div>
        <h1>HOME</h1>
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(Home);
