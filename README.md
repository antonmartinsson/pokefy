# Pokéfy

### A devX 2018 hack

Pokéfy is a web application developed at Spotify HQ in Stockholm by Willy Liu, Matilda Trodin, Anton Martinsson, Josip Matak and Nikhil Punnam. It uses both the Spotify Web API, and the open source PokéAPI, to create a silly little game. Upon authorizing the app to access your Spotify music listening history, it presents you with your 10 most recently played songs and prompts you to choose one. It then generates a Pokémon based on the genre of music you selected (for example, a rock song gives you a random Rock-type Pokémon), and presents a short battle scenario you can play through.

Here's how to run the application once you've downloaded the repository:

0. Clone the `.env.example` file to `.env.production` and put in your credentials.
1. Open two terminal windows.
1. Navigate to the repo folder in one window, and the `client` folder in the other.
1. Run `npm install` in both folders to install all dependencies.
1. Run `npm start` in both folders to start the server and front-end in development mode.
1. Voilà. The app should open automatically in your standard browser.

The page will reload if you make edits.
You will also see any errors in the console.

Built with React/JavaScript on the front-end and NodeJS in the back-end.
