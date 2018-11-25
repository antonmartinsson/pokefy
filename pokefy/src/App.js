import React, { Component } from 'react';
import * as api from './api';
import './App.css';
import Grid from './modules/grid';
import PokeGame from './modules/pokeGame';
import Loading from './modules/Loading';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: 'login',
      recentTracks: [],
      currentPokemon: null,
      opponentPokemon: null,
      currentTrack: null,
      opponentTrack: null,
      playedTrackIds: {},
    };
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
    this.setState({ recentTracks: json.body.items });
  };

  moveToGrid = () => {
    this.setState({
      gameState: 'grid',
    });
    this.getRecent();
  };

  moveToLoading = async selectedTrack => {
    this.setState(state => ({
      gameState: 'loading',
      currentTrack: selectedTrack,
      playedTrackIds: { ...state.playedTrackIds, [selectedTrack.track.id]: true },
    }));
  };

  moveToGame = (currentPokemon, opponentTrack, opponentPokemon) => {
    this.setState({
      gameState: 'game',
      currentPokemon,
      opponentTrack,
      opponentPokemon,
    });
  };

  moveToStart = () => {
    this.setState({
        gameState: 'login',
    });
  }

  render() {
    const { gameState } = this.state;

    if (gameState === 'login') {
      return (
        <div className='App'>
          <header className='App-header'>
            <div className='logoDiv'>
              <img src='https://i.imgur.com/xBo8wTW.png' alt='' />
              <img
                alt=''
                className='pokeball'
                src='https://i.imgur.com/a6eN9Ix.png'
                onClick={this.moveToGrid}
              />
            </div>
            <p className='pressPokeBall'>Press the Poké Ball to begin</p>
          </header>
        </div>
      );
    }

    if (gameState === 'grid') {
      return (
        <div className='App'>
          <Grid
            action={this.moveToLoading}
            playedTrackIds={this.state.playedTrackIds}
            tracks={this.state.recentTracks}
          />
        </div>
      );
    }

    if (gameState === 'loading') {
      return (
        <div className='App'>
          <Loading currentTrack={this.state.currentTrack} moveToGame={this.moveToGame} />
        </div>
      );
    }

    if (gameState === 'game') {
      return (
        <div className='App'>
          <header className='App-header'>
            <PokeGame
              action={this.moveToGrid}
              pokemon={this.state.currentPokemon}
              opponent={this.state.opponentPokemon}
              playerTrack={this.state.currentTrack}
              opponentTrack={this.state.opponentTrack}
              endGame={this.moveToStart}
            />
          </header>
        </div>
      );
    }
  }
}

export default App;
