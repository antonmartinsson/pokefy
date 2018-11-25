require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./localStorage');

const app = express();
const PORT = 5000;

const spotifyScopes = ['user-read-recently-played', 'user-modify-playback-state'];
const redirectUri = 'http://localhost:3000';
const state = 'randomstatelol';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri,
});

let storedAuthData = localStorage.getItem('AUTH_DATA');
let isAuthorized = false;
if (storedAuthData) {
  isAuthorized = true;
  const data = JSON.parse(storedAuthData);
  spotifyApi.setAccessToken(data.body.access_token);
  spotifyApi.setRefreshToken(data.body.refresh_token);
  spotifyApi.refreshAccessToken().then(data => {
    console.log('Refreshed tokens');
    spotifyApi.setAccessToken(data.body.access_token);
  });
  setInterval(() => {
    spotifyApi.refreshAccessToken().then(data => {
      console.log('Refreshed tokens automatically');
      spotifyApi.setAccessToken(data.body.access_token);
    });
  }, 3600 * 60);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/spotify/auth', (_, res) => {
  console.log('GET /spotify/auth');
  if (!isAuthorized) {
    const authUrl = spotifyApi.createAuthorizeURL(spotifyScopes, state);
    res.status(200).send({ authUrl });
  } else {
    res.status(200).send({ authUrl: '' });
  }
});

app.post('/spotify/code', async (req, res) => {
  console.log('POST /spotify/code');
  console.log(req.body);

  try {
    const data = await spotifyApi.authorizationCodeGrant(req.body.code);
    console.log(data);
    localStorage.setItem('AUTH_DATA', JSON.stringify(data));
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);
    isAuthorized = true;
    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
});

app.get('/spotify/recent-tracks', async (_, res) => {
  console.log('GET /spotify/recent-tracks');
  const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 });
  res.status(200).send(data);
});

app.get('/spotify/get-genre/:artistId', async (req, res) => {
  console.log('GET /spotify/get-genre/' + req.params.artistId);
  const { artistId } = req.params;
  const data = await spotifyApi.getArtist(artistId);
  console.log(data);
  res.status(200).send(data);
});

app.get('/spotify/play/:songId', async (req, res) => {
  console.log('GET /spotify/play/' + req.params.songId);
  const { songId } = req.params;
  await spotifyApi.setRepeat({ state: 'track' });
  spotifyApi.play({ uris: ['spotify:track:' + songId] });
});

app.get('/spotify/random-song', async (req, res) => {
  console.log('GET /spotify/random-song');
  let alphabet = 'abcdefghijklmnopqrstuvwxyz';
  let query = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  console.log('query : ' + query);
  spotifyApi.searchTracks(query, { limit: 1 }).then(
    function(data) {
      console.log(data.body.tracks.items[0]);
      res.status(200).send(data.body.tracks.items[0]);
    },
    function(err) {
      console.error(err);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} 🔥`);
});
