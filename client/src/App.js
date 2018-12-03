import React, { Component } from 'react';
import * as api from './api';
import Grid from './components/Grid';
import PokeGame from './components/PokeGame';
import Transition from './components/Transition';
import './App.css';

class App extends Component {
  state = {
    gameState: 'login',
    recentTracks: [],
    currentPokemon: null,
    opponentPokemon: null,
    currentTrack: null,
    opponentTrack: null,
    playedTrackIds: {},
  };

  componentDidMount() {
    this.authorize();
  }

  async authorize() {
    const storedToken = localStorage.getItem('ACCESS_TOKEN');
    if (storedToken) {
      await api.refreshToken();
      this.refreshPeriodically();
      this.moveToStart();
      return;
    }

    const url = new URLSearchParams(window.location.search);
    const authCallBackCode = url.get('code');
    const verificationState = url.get('state');

    if (authCallBackCode && verificationState) {
      // The user has authorized this app and has been sent back.
      // Request new access token
      await api.authorize(authCallBackCode);
      this.refreshPeriodically();
      this.moveToStart();
      window.history.pushState(null, null, '/');
      return;
    }

    // Request Spotify login url from back-end and send user there.
    await api.login();
  }

  refreshPeriodically() {
    // Get new token every hour
    setInterval(() => {
      console.log('Auto refreshing token');
      api.refreshToken();
    }, 1000 * 60 * 60);
  }

  getRecent = async () => {
    const tracks = await api.getRecentTracks();
    this.setState({ recentTracks: tracks });
  };

  moveToGrid = () => {
    this.setState({
      gameState: 'grid',
    });
    this.getRecent();
  };

  moveToTransition = async selectedTrack => {
    this.setState(state => ({
      gameState: 'transition',
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
  };

  render() {
    const { gameState } = this.state;
    console.log(gameState);

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
            action={this.moveToTransition}
            playedTrackIds={this.state.playedTrackIds}
            tracks={this.state.recentTracks}
          />
        </div>
      );
    }

    if (gameState === 'transition') {
      return (
        <div className='App'>
          <Transition currentTrack={this.state.currentTrack} moveToGame={this.moveToGame} />
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
