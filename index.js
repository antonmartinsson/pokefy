require('dotenv').config({ path: './.env.production' });
const path = require('path');
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./localStorage');

const POKEAPI = 'https://pokeapi.co/api/v2';
const app = express();
const PORT = process.env.PORT || 5000;

const spotifyScopes = ['user-read-recently-played', 'user-modify-playback-state'];
const redirectUri =
  process.env.NODE_ENV === 'production'
    ? 'https://pokefy-devx.herokuapp.com'
    : 'http://localhost:3000';
const state = 'randomstatelol';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri,
});

async function spotifyReq(endpoint, token, options = {}) {
  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...options,
  });
  // If method is PUT, don't convert to json
  if (options && options.method && options.method === 'PUT') {
    return;
  }
  const json = await res.json();
  return json;
}

app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/spotify/getauthurl', (_, res) => {
  console.log('GET /spotify/getauthurl');
  const authUrl = spotifyApi.createAuthorizeURL(spotifyScopes, state);
  console.log(authUrl);
  res.status(200).send({ authUrl });
});

app.post('/spotify/gettokens', async (req, res) => {
  console.log('POST /spotify/gettokens');
  console.log(req.body);

  try {
    const data = await spotifyApi.authorizationCodeGrant(req.body.code);
    console.log(data);
    const { access_token, refresh_token } = data.body;
    localStorage.setItem(access_token, refresh_token);
    res.status(200).send({ access_token });
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

app.get('/spotify/refresh/:token', async (req, res) => {
  console.log('GET /spotify/refresh/' + req.params.token);
  const { token } = req.params;
  const refresh_token = localStorage.getItem(token);

  if (!refresh_token) {
    console.log('No token found');
    res.status(400).send({});
    return;
  }

  console.log('Stored token:', refresh_token);

  spotifyApi.setRefreshToken(refresh_token);
  const data = await spotifyApi.refreshAccessToken();
  console.log(data);
  const { access_token } = data.body;
  localStorage.setItem(access_token, refresh_token);
  res.status(200).send({ access_token });
});

app.get('/spotify/recent-tracks', async (req, res) => {
  console.log('GET /spotify/recent-tracks');
  const { access_token } = req.query;
  const data = await spotifyReq('/me/player/recently-played?limit=50', access_token);
  console.log(data);
  res.status(200).send(data);
});

app.get('/spotify/artist/:artistId', async (req, res) => {
  console.log('GET /spotify/artist/' + req.params.artistId);
  const { artistId } = req.params;
  const { access_token } = req.query;
  const data = await spotifyReq(`/artists/${artistId}`, access_token);
  console.log(data);
  res.status(200).send(data);
});

app.get('/spotify/play/:songId', async (req, res) => {
  console.log('GET /spotify/play/' + req.params.songId);
  const { songId } = req.params;
  const { access_token } = req.query;

  spotifyReq('/me/player/repeat?state=track', access_token, { method: 'PUT' });
  await spotifyReq('/me/player/pause', access_token, { method: 'PUT' });
  await spotifyReq(`/me/player/play`, access_token, {
    method: 'PUT',
    body: JSON.stringify({
      uris: [`spotify:track:${songId}`],
      offset: {
        position: 0,
      },
      position_ms: 0,
    }),
  });
  res.sendStatus(200);
});

app.get('/spotify/get-track-features/:songId', async (req, res) => {
  console.log('GET /spotify/get-track-features/' + req.params.songId);
  const { songId } = req.params;
  const { access_token } = req.query;
  const data = await spotifyReq(`/audio-features/${songId}`, access_token);
  res.status(200).send(data);
});

app.get('/spotify/random-song', async (req, res) => {
  console.log('GET /spotify/random-song');
  const { access_token } = req.query;
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const query = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  console.log('query : ' + query);

  const data = await spotifyReq(`/search?q=${query}&type=track&limit=20`, access_token);
  const { items } = data.tracks;
  const randIndex = Math.floor(Math.random() * Math.floor(20));
  res.status(200).send(items[randIndex]);
});

app.get('/pokemon/type/:type', async (req, res) => {
  const { type } = req.params;
  console.log(`GET /pokemon/type/${type}`);
  try {
    const pokemonRes = await fetch(`${POKEAPI}/type/${type}/`);
    const json = await pokemonRes.json();
    res.status(200).send(json);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

app.get('/pokemon/pokemon/:name', async (req, res) => {
  const { name } = req.params;
  console.log(`GET /pokemon/pokemon/${name}`);
  try {
    const pokemonRes = await fetch(`${POKEAPI}/pokemon/${name}/`);
    const json = await pokemonRes.json();
    res.status(200).send(json);
  } catch (error) {
    console.error(error);
    res.status(400);
  }
});

app.get('/pokemon/move/:name', async (req, res) => {
  const { name } = req.params;
  console.log(`GET /pokemon/move/${name}`);
  try {
    const pokemonRes = await fetch(`${POKEAPI}/move/${name}/`);
    const json = await pokemonRes.json();
    res.status(200).send(json);
  } catch (error) {
    console.error(error);
    res.status(200).send({});
  }
});

app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} 🔥`);
});
