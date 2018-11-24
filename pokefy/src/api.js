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

export async function getPokemonFromTrack(track) {
  const artistId = track.track.artists[0].id;
  const genres = await getArtistGenres(artistId);
  const pokemon = await getPokemonFromGenre(genres[0]);
  return pokemon;
}

export async function getPokemonFromGenre(genre) {
  return {};
}
