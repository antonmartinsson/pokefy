import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PokeGame from './modules/pokeGame';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        <PokeGame/>

        </header>
      </div>
    );
  }
}

export default App;
