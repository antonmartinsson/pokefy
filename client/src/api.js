import stringSimilarity from 'string-similarity';
import match from './genreTypes';

export function findBestMatch(genre) {
  return match[stringSimilarity.findBestMatch(genre, Object.keys(match)).bestMatch.target];
}

export function findGenresMatch(genres) {
  let genresString = genres.join(' ');
  return match[stringSimilarity.findBestMatch(genresString, Object.keys(match)).bestMatch.target];
}

function calculateSimilarity(pokeType, songType) {
  return stringSimilarity.compareTwoStrings(pokeType, songType);
}

function extractTypes(pokemon) {
  return pokemon.types.map(t => t.type.name).join(' ');
}

const shuffleArray = arr =>
  arr
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1]);

export async function authorize(code) {
  await fetch('/spotify/code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
    }),
  });
}

export async function login() {
  const res = await fetch('/spotify/auth');
  const authUrl = (await res.json()).authUrl;
  if (authUrl) {
    window.location = authUrl;
  }
}

export async function getRandomSong() {
  const res = await fetch('/spotify/random-song');
  const json = await res.json();
  return json;
}

export async function getArtistGenres(artistId) {
  const res = await fetch('/spotify/get-genre/' + artistId);
  const json = await res.json();
  return json.body.genres;
}

async function getPokemonType(type) {
  console.log('get pokemon type');
  const typeRes = await fetch(`/pokemon/type/${type}/`);
  const json = await typeRes.json();
  return json;
}

async function getPokemonDetails(randPokemon) {
  console.log('get pokemon details');
  const pokemonRes = await fetch(`/pokemon/pokemon/${randPokemon}/`);
  const json = await pokemonRes.json();
  return json;
}

export async function getMoveInformation(moveName) {
  const moveRes = await fetch(`/pokemon/move/${moveName}/`);
  return await moveRes.json();
}

export async function playSong(songId) {
  await fetch('/spotify/play/' + songId);
}

export async function getTrackFeatures(songId) {
  console.log('Get Features of the track');
  console.log(songId);
  const trackRes = await fetch('/spotify/get-track-features/' + songId);
  const json = await trackRes.json();
  return json;
}

async function getPokemonFromGenre(genres) {
  const topGenre = findGenresMatch(genres);
  const songTypes = genres.map(g => findBestMatch(g)).join(' ');
  const pokemonJSON = await getPokemonType(topGenre || 'normal');
  try {
    let pokemons = shuffleArray(pokemonJSON.pokemon);
    const pokemonLimit = 15;
    pokemons = pokemons.slice(0, pokemonLimit);

    pokemons = await Promise.all(
      pokemons.map(async poke => await getPokemonDetails(poke.pokemon.name))
    );
    pokemons.forEach(p => {
      p.similarity = calculateSimilarity(extractTypes(p), songTypes);
    });

    pokemons.sort(function(a, b) {
      return -(a.similarity - b.similarity);
    });

    let pokemon, sprite;
    let i = 0;
    do {
      pokemon = pokemons[i++];
      sprite = pokemon.sprites.front_default;
    } while (sprite === null);

    console.log(pokemon);
    return pokemon;
  } catch (err) {
    return getPokemonDetails(pokemonJSON.pokemon[0].pokemon.name);
  }
}

async function getMewtwo() {
  const mewtwo = getPokemonDetails('mewtwo');
  return mewtwo;
}

export async function getPokemonFromTrack(track) {
  if (track.track.id === '6xG2ZGudUgtV235xvDlSEt') {
    return await getMewtwo();
  }
  const artistId = track.track.artists[0].id;
  const genres = await getArtistGenres(artistId);
  let genreNames = [];
  genres.forEach(g => genreNames.push((g || '').split(' ')));
  return await getPokemonFromGenre(genres);
}
