import React, { Component } from 'react';
import '../App.css';
import GridItem from './grid-item';
import './grid.css';

class Grid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      readyForGame: false,
    };
  }

  getTracks() {
    const { tracks, playedTrackIds } = this.props;
    return tracks.filter(track => !playedTrackIds[track.track.id]).slice(0, 10);
  }

  render() {
    const { tracks } = this.props;
    console.log(tracks);
    const displayTracks = this.getTracks();
    console.log(displayTracks);

    return (
      <div>
        <div className='title'>Pick a song</div>
        <div className='subtitle'>Let your music taste decide your next Pokémon champion!</div>
        <br />
        <div className='song-grid'>
          {displayTracks.map(track => (
            <GridItem
              track={track}
              key={track.played_at}
              moveToGame={this.props.action}
              ready={this.props.readyForGame}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Grid;
