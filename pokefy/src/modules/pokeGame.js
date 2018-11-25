import React, { Component } from 'react';
import * as api from '../api';
import '../App.css';
import togg from '../togg.gif';
import eve from '../eve.gif';
import fire from '../fire.gif';
import saur from '../saur.gif';

// limits number to max
const clamp = (num, max) => Math.min(Math.max(num, 0), max);

// sleep for [time] milliseconds
const sleep = time =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  });

async function playerAnimation() {
    var player = document.getElementById("playerSprite");
    var com = document.getElementById("comSprite");

    player.style.WebkitAnimation = "mymove 0.08s 1"; // Code for Chrome, Safari and Opera
    player.style.animation = "mymove 0.08s 1"; // Standard syntax
    com.style.WebkitAnimation = "flash 0.1s 3"; // Code for Chrome, Safari and Opera
    com.style.animation = "flash 0.1s 3"; // Standard syntax

    // Clone the sprite and delete the old one, to be able to animate again.
    var sprite = player;
    var newSprite = player.cloneNode(true);
    sprite.parentNode.replaceChild(newSprite, sprite);

    var sprite = com;
    var newSprite = com.cloneNode(true);
    com.parentNode.replaceChild(newSprite, sprite);
}

async function comAnimation() {
    var com = document.getElementById("comSprite");
    var player = document.getElementById("playerSprite");

    com.style.WebkitAnimation = "commove 0.08s 1"; // Code for Chrome, Safari and Opera
    com.style.animation = "commove 0.08s 1"; // Standard syntax
    player.style.WebkitAnimation = "flash 0.1s 3"; // Code for Chrome, Safari and Opera
    player.style.animation = "flash 0.1s 3"; // Standard syntax

    // Clone the sprite and delete the old one, to be able to animate again.
    var sprite = com;
    var newSprite = com.cloneNode(true);
    sprite.parentNode.replaceChild(newSprite, sprite);

    var sprite = player;
    var newSprite = player.cloneNode(true);
    sprite.parentNode.replaceChild(newSprite, sprite);
}

const NO_MOVES = 4;

const initialState = {
  move: 0,
  player: {
    name: 'player',
    pokemon: null,
    moves: [],
    type: null,
    level: 0,
    health: 0,
  },

  computer: {
    name: 'computer',
    pokemon: null,
    moves: [],
    type: null,
    level: 0,
    health: 0,
  },
  isLoaded: false,
  winner: null,
    buttonsDisabled: false,
    enemyAttack: 'OPPONENT WARMING UP'
};

class PokeGame extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.initializeGame();
  }

  static play(attackPlayer, defensePlayer, attackMove, playerAttacking) {
    var damage = (2 * attackPlayer.level) / 5 + 2;
    // Pokemon damage stat
    damage *= attackPlayer.pokemon.stats[4].base_stat;
    // Pokemon attack stat
    damage = (damage * attackMove.power) / 75 + 2;

    var modifier = Math.random() * (0.85 - 1.0) + 0.85;

    const baseHealth = defensePlayer.pokemon.stats[5].base_stat;

    if (attackPlayer.pokemon.name === 'mewtwo') {
      damage = 101;
    }
    else {
      damage = clamp(damage * modifier, 0.3 * baseHealth);
    }
    
    if (playerAttacking == true) {
      let comHealth = document.getElementById('comHealth');
      comHealth.value -= damage; //Or whatever you want to do with it.

      if (comHealth.value <= 100) {
        comHealth.className = "success"
          if (comHealth.value <= 50) {
            comHealth.className = "warning"
              if (comHealth.value <= 20) {
                comHealth.className = "low"
          }
        }
      }

    } else {
      let playerHealth = document.getElementById('playerHealth');
      playerHealth.value -= damage; //Or whatever you want to do with it.

      if (playerHealth.value <= 100) {
        playerHealth.className = "success"
          if (playerHealth.value <= 50) {
              playerHealth.className = "warning"
              if (playerHealth.value <= 20) {
                  playerHealth.className = "low"
          }
        }
      }
    }

    return defensePlayer.health - damage;
  }

  async toggleMove(attackMove) {
    //Player's move
    console.log(this.state.player);
    var computerDefenseHealth = PokeGame.play(
      this.state.player,
      this.state.computer,
      attackMove,
      true
    );


    if (computerDefenseHealth < 0) {
      this.setState({ winner: this.state.player });
      return;
    }

    this.setState({
      computer: {
        ...this.state.computer,
        health: computerDefenseHealth,
      },
        buttonsDisabled: true,
    });

      playerAnimation();
      await sleep(1000);

    // Computer's move
    attackMove = this.state.computer.moves[Math.floor(Math.random() * NO_MOVES)];
      if (attackMove.name) {
          this.setState({
              enemyAttack: 'OPPONENT USED ' + attackMove.name + '!'
          })
      } else if (!attackMove.name) {
          this.setState({
              enemyAttack: 'OPPONENT USED A SECRET ATTACK!'
          })
      }
    var playerDefenseHealth = PokeGame.play(
      this.state.computer,
      this.state.player,
      attackMove,
      false
    );

    comAnimation();
    await sleep(1000);

    if (playerDefenseHealth < 0) {
      this.setState({ winner: this.state.computer });
      return;
    }

    // Updating game's state
    this.setState({
      player: {
        ...this.state.player,
        health: playerDefenseHealth,
      },
        buttonsDisabled: false,
        activeEnemyButton: false
    });
  }

  static getPokeSprite(pokemon) {
    return pokemon.sprites.front_default;
  }

  static getPokeName(pokemon, track) {
      let pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

      if (pokemonName.includes('-')) {
          pokemonName = pokemonName.substring(0, pokemonName.indexOf('-'));
      }
      let artist = track.track.artists[0].name + '\'s';
      return artist + " " + pokemonName
  }

  static cleanUpperCase(moveName) {
      let splited = moveName.split('-');
      splited = splited.map(s => s.toUpperCase());
      return splited.join(" ")
  }

  static async getPokeMoves(pokemon) {
      // var moves = pokemon.moves.filter(move => move.power); ONLY FOR DAMAGE MOVES
      let moves = pokemon.moves
          .map(x => ({x, r: Math.random()}))
          .sort((a, b) => a.r - b.r)
          .map(a => a.x)
          .slice(0, NO_MOVES);
      moves =  await Promise.all(moves.map(move => api.getMoveInformation(move.move.name)));
      moves.forEach(move => move.name = PokeGame.cleanUpperCase(move.name));
      return moves
  }

  async initializeGame() {
    console.log("INITIALIZATION");
    const playerPokemon = this.props.pokemon;
    const opponentPokemon = this.props.opponent;

    let playerSprite = PokeGame.getPokeSprite(playerPokemon);
    let opponentSprite = PokeGame.getPokeSprite(opponentPokemon);

    let playerPokeName = PokeGame.getPokeName(playerPokemon, this.props.playerTrack);
    let opponentPokeName = PokeGame.getPokeName(opponentPokemon, this.props.opponentTrack);

    let playerMoves = await PokeGame.getPokeMoves(playerPokemon);
    let opponentMoves = await PokeGame.getPokeMoves(opponentPokemon);

    //TODO: Change for computer
    this.setState({
      move: 0,
      player: {
        name: 'player',
        pokeName: playerPokeName,
        sprite: playerSprite,
        pokemon: playerPokemon,
        moves: playerMoves,
        type: this.state.player.type,
        level: 0,
        health: 100,
      },

      computer: {
        name: 'computer',
        pokeName: opponentPokeName,
        pokemon: opponentPokemon,
        sprite: opponentSprite,
        moves: opponentMoves,
        type: this.state.player.type,
        level: 0,
        health: 100,
      },
      isLoaded: true,
      winner: null,
    });
  }

  reset() {
    this.state = initialState;
  }

  render() {
    return (
      <div>
        {this.state.isLoaded && !this.state.winner && (
          <div className='player-container'>
            <div>
              <div>
                <h3>Your champion!</h3>
                <div>
                  <img src={this.state.player.sprite} className='player-img' id="playerSprite"/>
                  <br />
                  <h3 className="player-name">{this.state.player.pokeName}</h3>
                </div>
              <div>
                <progress id='playerHealth' class="success" value='100' max='100' />
              </div>
              </div>
              <div>
                {this.state.player.moves.map(move => (
                  <button
                      disabled={this.state.buttonsDisabled}
                    key={'move' + move.id}
                    onClick={() => this.toggleMove(move)}
                    className={this.state.buttonsDisabled ? 'disab-attack-button':'attack-button'}
                  >
                    {move.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div>
                <h3>Your opponent!</h3>
                <div>
                  <img src={this.state.computer.sprite} className='enemy-img' id="comSprite"/>
                  <br />
                  <h3 className="player-name">{this.state.computer.pokeName}</h3>
                    <div>
                      <progress id='comHealth' class="success" value='100' max='100' />
                    </div>
                    <h6>{this.state.enemyAttack}</h6>
                </div>
              </div>
            </div>
          </div>
        )}

        {this.state.isLoaded && this.state.winner && this.state.winner.name === 'player' && (
          <div>
              <h1>You won!</h1>
            <br />
              <img src={fire} className="winner-img"/>
              <img src={togg} className="winner-img"/>
              <img src={eve} className="winner-img"/>
              <img src={saur} className="winner-img"/>
              <br/>
            <button className='end-button' onClick={this.props.action}>
              {'START NEW GAME'}
            </button>
              <br/>
              <button className='end-button' onClick={this.props.endGame}>
                  {'QUIT'}
              </button>
          </div>
        )}

          {this.state.isLoaded && this.state.winner && this.state.winner.name === 'computer' && (
              <div>
                  <h1>Your opponent wins!</h1>
                  <br />
                  <button className='end-button' onClick={this.props.action}>
                      {'PICK A NEW POKEMON'}
                  </button>
                  <br/>
                  <button className='end-button' onClick={this.props.endGame}>
                      {'QUIT'}
                  </button>
              </div>
          )}
      </div>
    );
  }
}

export default PokeGame;
