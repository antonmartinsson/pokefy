import React, { Component } from 'react';
import * as api from './api';
import './App.css';
import Grid from './modules/grid';
import PokeGame from './modules/pokeGame';

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
    this.setState({ recentTracks: json.body.items });
  };

  moveToGrid = () => {
    this.setState({
      gameState: 'grid',
    });
    this.getRecent();
  };

  moveToGame = async (pokemon, track, trackId) => {
      let randomTrack = {track: await api.getRandomSong()};
      let opponentPokemon = await api.getPokemonFromTrack(randomTrack);
      this.setState(state => ({
          gameState: 'game',
          currentPokemon: pokemon,
          opponentPokemon: opponentPokemon,
          currentTrack: track,
          opponentTrack: randomTrack,
          playedTrackIds: {...state.playedTrackIds, [trackId]: true},
      }));
  };

  render() {
    if (this.state.gameState === 'login')
      return (
        <div className='App'>
          <header className='App-header'>
            <div className='logoDiv'>
              <img src='https://i.imgur.com/xBo8wTW.png' />
              <img
                className='pokeball'
                src='https://i.imgur.com/a6eN9Ix.png'
                onClick={this.moveToGrid}
              />
            </div>
            <p className='pressPokeBall'>Press the Poké Ball to begin</p>
          </header>
        </div>
      );
    else if (this.state.gameState === 'grid')
      return (
        <div className='App'>
          <Grid
            action={this.moveToGame}
            playedTrackIds={this.state.playedTrackIds}
            tracks={this.state.recentTracks}
          />
        </div>
      );
    else if (this.state.gameState === 'game')
      return (
        <div className='App'>
          <header className='App-header'>
            <PokeGame
                action={this.moveToGrid}
                pokemon={this.state.currentPokemon}
                opponent={this.state.opponentPokemon}
                playerTrack={this.state.currentTrack}
                opponentTrack={this.state.opponentTrack}
            />
          </header>
        </div>
      );
  }
}

export default App;
