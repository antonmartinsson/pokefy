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

export async function getArtistGenres(artistId) {
  const res = await fetch('/spotify/get-genre/' + artistId);
  const json = await res.json();
  return json.body.genres;
}

async function getPokemonType(type) {
  console.log('get pokemon type');
  const typeRes = await fetch('http://pokeapi.co/api/v2/type/' + type);
  const json = await typeRes.json();
  return json;
}

async function getPokemonDetails(randPokemon) {
  console.log('get pokemon details');
  const pokemonRes = await fetch('http://pokeapi.co/api/v2/pokemon/' + randPokemon);
  const json = await pokemonRes.json();
  return json;
}

export async function getMoveInformation(moveName) {
  const moveRes = await fetch('http://pokeapi.co/api/v2/move/' + moveName);
  return await moveRes.json();
}

export async function playSong(songId) {
  await fetch('/spotify/play/' + songId);
}

async function getPokemonFromGenre(genre) {
  var match = {
    acoustic: 'normal',
    afrobeat: 'water',
    'alt-rock': 'rock',
    alternative: 'normal',
    ambient: 'water',
    anime: 'fairy',
    'black-metal': 'steel',
    bluegrass: 'grass',
    blues: 'flying',
    bossanova: 'fire',
    brazil: 'fire',
    breakbeat: 'fighting',
    british: 'normal',
    cantopop: 'normal',
    children: 'bug',
    chill: 'ice',
    classical: 'water',
    club: 'poison',
    comedy: 'bug',
    country: 'grass',
    dance: 'ground',
    dancehall: 'flying',
    'death-metal': 'steel',
    'deep-house': 'electric',
    'detroit-techno': 'electric',
    disco: 'ground',
    disney: 'bug',
    dub: 'flying',
    dubstep: 'bug',
    edm: 'electric',
    electro: 'electric',
    electronic: 'electric',
    emo: 'dark',
    folk: 'flying',
    forro: 'fire',
    funk: 'flying',
    gospel: 'water',
    goth: 'ghost',
    groove: 'fire',
    guitar: 'normal',
    happy: 'normal',
    'hard-rock': 'rock',
    hardcore: 'rock',
    house: 'electric',
    'hip-hop': 'fighting',
    'heavy-metal': 'steel',
    holidays: 'normal',
    idm: 'electro',
    indian: 'ground',
    'indie-pop': 'normal',
    indie: 'water',
    'j-dance': 'fairy',
    'j-idol': 'fairy',
    'j-pop': 'fairy',
    'j-rock': 'rock',
    jazz: 'flying',
    'k-pop': 'fairy',
    kids: 'bug',
    latin: 'normal',
    latino: 'fire',
    malay: 'ground',
    mandopop: 'normal',
    metal: 'steel',
    'metal-misc': 'steel',
    metalcore: 'steel',
    'minimal-techno': 'electric',
    movies: 'normal',
    mpb: 'fire',
    opera: 'water',
    party: 'electric',
    piano: 'water',
    pop: 'normal',
    'pop-film': 'normal',
    'post-dubstep': 'bug',
    'power-pop': 'normal',
    'progressive-house': 'electric',
    'psych-rock': 'rock',
    punk: 'rock',
    'punk-rock': 'rock',
    'r-n-b': 'normal',
    'rainy-day': 'dark',
    reggae: 'flying',
    reggaeton: 'flying',
    'road-trip': 'normal',
    rock: 'rock',
    romance: 'grass',
    sad: 'dark',
    salsa: 'fire',
    samba: 'fire',
    sleep: 'water',
    soul: 'flying',
    spanish: 'fire',
    study: 'normal',
    summer: 'normal',
    swedish: 'ice',
    'synth-pop': 'electric',
    tango: 'fire',
    techno: 'poison',
    trance: 'psychic',
    'trip-hop': 'poison',
    'work-out': 'fighting',
    'world-music': 'normal',
  };
  const pokemonJSON = await getPokemonType(match[genre] || 'normal');
  var pokeAmount = pokemonJSON.pokemon.length;
  let randPokemonID, randPokemon, pokemon, sprite;
  do {
    randPokemonID = Math.round(Math.random() * (pokeAmount - 1));
    randPokemon = pokemonJSON.pokemon[randPokemonID].pokemon.name;
    pokemon = await getPokemonDetails(randPokemon);
    sprite = pokemon.sprites.front_default;
  } while (sprite === null);

  console.log(pokemon);
  return pokemon;
}

export async function getPokemonFromTrack(track) {
  const artistId = track.track.artists[0].id;
  const genres = await getArtistGenres(artistId);
  return await getPokemonFromGenre((genres[0] || '').split(' ')[0]);
}

//export async function getPokemonFromGenre(genre) {
//  return {};
//}
