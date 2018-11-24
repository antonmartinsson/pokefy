import React, { Component } from 'react';
import * as api from './api';
import logo from './logo.svg';
import './App.css';

class App extends Component {
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
  };

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className='App-link'
            href='https://reactjs.org'
            target='_blank'
            rel='noopener noreferrer'
          >
            Learn React
          </a>
          <button onClick={this.getRecent}>Get recents</button>
        </header>
      </div>
    );
  }
}

export default App;
