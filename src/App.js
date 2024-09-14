import React from 'react';
import './App.css';
import CountrySearch from './components/CountrySearch'; // Updated import path

function App() {
  return (
    <div className="container">
      <h1>Global Search Bar</h1>
      <CountrySearch />
    </div>
  );
}

export default App;
