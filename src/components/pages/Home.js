import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const mapState = null;
const mapDispatch = null;

class Home extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div id="home">
        <h1 className="title">SECRET TITLES</h1>
        <div>
          <Link to="/local"><button className="btn">Play locally</button></Link>
          <Link to="/"><button className="btn">Play remotely</button></Link>
        </div>
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(Home);
