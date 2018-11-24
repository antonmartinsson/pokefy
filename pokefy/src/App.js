import React, { Component } from 'react';
import * as api from './api';
import './App.css';
import Grid from "./modules/grid";
import bulba from './bulba.png';

class App extends Component {

  constructor(props) {
      super(props);
      this.state = {
        gameState: 'login',
          recentTracks: []
      }

      this.moveToGame = this.moveToGame.bind(this);
  }
  
  async componentDidMount() {
    await this.authorize();
  }

  async authorize() {
    const url = new URLSearchParams(window.location.search);
    const authCallBackCode = url.get('code');
    const verificationState = url.get('state');

    if (authCallBackCode && verificationState) {
      await api.authorize(authCallBackCode);
      window.history.pushState(null, null, '/');
      return;
    }

    await api.login();
  }

  getRecent = async () => {
    const data = await fetch('/spotify/recent-tracks');
    const json = await data.json();
    console.log(json.body.items.map(item => item.track.name));
    this.setState({recentTracks: json.body.items});
  };

    moveToGrid = () => {
        this.setState({
            gameState: 'grid'
        });
        this.getRecent();
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
                  <Grid action={this.moveToGame} tracks={this.state.recentTracks}/>
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