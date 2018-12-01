import React, { Component } from 'react';
import GridItem from '../GridItem';
import './styles.css';

class Grid extends Component {
  state = {
    readyForGame: false,
  };

  getTracks() {
    const { tracks, playedTrackIds } = this.props;

    // filter out duplicates
    const seenTracks = {};
    const uniqueTracks = tracks.filter(track => {
      const { id } = track.track;

      const hasSeenTrack = seenTracks[id] === true;
      seenTracks[id] = true;

      return !hasSeenTrack;
    });
    // filter out previously played tracks;
    return uniqueTracks.filter(track => !playedTrackIds[track.track.id]).slice(0, 10);
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
