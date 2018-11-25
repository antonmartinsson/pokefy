import React from 'react';
import * as api from '../api';
import './Loading.css';

const sleep = time =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });

function getPokeName(pokemon, track) {
  if (!pokemon) {
    return '';
  }

  let pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  if (pokemonName.includes('-')) {
    pokemonName = pokemonName.substring(0, pokemonName.indexOf('-'));
  }
  let artist = track.track.artists[0].name + "'s";
  return artist + ' ' + pokemonName;
}

class Loading extends React.Component {
  state = {
    currentPokemon: null,
    genres: '',
    type: '',
    shouldFadeOut: false,
  };

  async componentDidMount() {
    const { currentTrack, moveToGame } = this.props;
    const artistId = currentTrack.track.artists[0].id;

    console.log('Get genres:');
    const genres = await api.getArtistGenres(artistId);
    setTimeout(() => {
      this.setState({
        genres: genres.length !== 0 ? genres.join(', ') : 'No genres',
      });
      console.log(genres);
    }, 1000);

    console.log('Get best type');
    const type = api.findBestMatch(genres[0] || '');
    setTimeout(() => {
      this.setState({
        type,
      });
      console.log(type);
    }, 2000);

    const currentPokemon = await api.getPokemonFromTrack(currentTrack);
    await sleep(2000);
    this.setState({
      currentPokemon,
    });

    const randomTrack = { track: await api.getRandomSong() };
    const opponentPokemon = await api.getPokemonFromTrack(randomTrack);

    await sleep(1000);
    this.setState({ shouldFadeOut: true });
    await sleep(1000);
    moveToGame(currentPokemon, randomTrack, opponentPokemon);
  }

  render() {
    const { currentTrack } = this.props;
    const albumCover = currentTrack.track.album.images[0].url;
    const { currentPokemon, genres, type, shouldFadeOut } = this.state;
    const sprite = currentPokemon ? currentPokemon.sprites.front_default : null;
    const pokemonName = getPokeName(currentPokemon, currentTrack);

    const loadingClasses = shouldFadeOut ? 'loading fadeout' : 'loading';
    const typeClasses = type ? 'type fadein' : 'type';
    const genreClasses = genres ? 'genre fadein' : 'genre';
    const spriteClasses = sprite ? 'pokemon fadein' : 'pokemon';

    return (
      <div className={loadingClasses}>
        <div className='album fadein'>
          <img src={albumCover} alt='' />
          <h3>
            {currentTrack.track.name} by {currentTrack.track.artists[0].name}
          </h3>
        </div>
        <div className='info'>
          <div className={genreClasses}>
            Genres:
            <br /> {genres || ''}
          </div>
          <div className={typeClasses}>
            Pokemon type:
            <br /> {type || ''}
          </div>
        </div>
        <div className={spriteClasses}>
          <img src={sprite} alt='' />
          <h3>{pokemonName}</h3>
        </div>
      </div>
    );
  }
}

export default Loading;
