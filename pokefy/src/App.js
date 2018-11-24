import React, { Component } from 'react';
import './App.css';
import Grid from "./modules/grid";
import bulba from './bulba.png';

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
        gameState: 'login'
      }

      this.moveToGame = this.moveToGame.bind(this);

  }

    moveToGrid = () => {
        this.setState({
            gameState: 'grid'
        });
    };

    moveToGame = () => {
        this.setState({
            gameState: 'game'
        });
    };

    render() {
    if (this.state.gameState === 'login')
        return (
            <div className="App">
                <header className="App-header">
                  <button onClick={this.moveToGrid}>Click me!</button>
                </header>
            </div>
        );
    else if (this.state.gameState === 'grid')
        return (
            <div className="App">
                <header className="App-header">
                  <Grid action={this.moveToGame}/>
                </header>
          </div>
        );
    else if (this.state.gameState === 'game')
        return (
            <div className="App">
                <header className="App-header">
                    <img src={bulba}/>
                </header>
            </div>
        );
    }
}

export default App;