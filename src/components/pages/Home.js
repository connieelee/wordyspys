import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div id="home">
    <h1 className="title">SECRET TITLES</h1>
    <div>
      <Link to="/local"><button className="btn">Play locally</button></Link>
      <Link to="/"><button className="btn">Play remotely</button></Link>
    </div>
  </div>
);

export default Home;
