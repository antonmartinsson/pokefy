import stringSimilarity from 'string-similarity';

const match = {
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

function findBestMatch(genre) {
    return match[stringSimilarity.findBestMatch(genre, Object.keys(match)).bestMatch.target];
}

function calculateSimilarity(pokeType, songType) {
    return stringSimilarity.compareTwoStrings(pokeType, songType);
}

function extractTypes(pokemon) {
    return pokemon.types.map(t => t.type.name).join(" ");
}

const shuffleArray = arr => arr
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

async function getPokemonFromGenre(genres) {
    const topGenre = findBestMatch(genres[0]);
    const songTypes = genres.map(g => findBestMatch(g)).join(" ");
    const pokemonJSON = await getPokemonType(topGenre || 'normal');
    try {
        let pokemons = shuffleArray(pokemonJSON.pokemon);
        const pokemonLimit = 15;
        pokemons = pokemons.slice(0, pokemonLimit);

        pokemons = await Promise.all(pokemons.map(async poke => await getPokemonDetails(poke.pokemon.name)));
        pokemons.forEach(p => {
            p.similarity = calculateSimilarity(
                extractTypes(p), songTypes
            )
        });

        pokemons.sort(function (a, b) {
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

export async function getPokemonFromTrack(track) {
    const artistId = track.track.artists[0].id;
    const genres = await getArtistGenres(artistId);
    let genreNames = [];
    genres.forEach(g => genreNames.push((g || '').split(' ')));
    return await getPokemonFromGenre(genres);
}