import React, {Component} from 'react';
import '../App.css';

const NO_MOVES = 4;

const initialState = {
    move: 0,
    player: {
        name: "player",
        pokemon: null,
        moves: [],
        type: null,
        level: 0,
        health: 0,
    },

    computer: {
        name: "computer",
        pokemon: null,
        moves: [],
        type: null,
        level: 0,
        health: 0,
    },
    isLoaded: false,
    winner: null
};

async function getType(typeName) {
    const typeRes = await fetch('http://pokeapi.co/api/v2/type/' + typeName);
    return await typeRes.json();
}

async function getDetails(pokeName) {
    const pokemonRes = await fetch('http://pokeapi.co/api/v2/pokemon/' + pokeName);
    return await pokemonRes.json();
}

async function getMoveInformation(moveName) {
    const moveRes = await fetch('https://pokeapi.co/api/v2/move/' + moveName);
    return await moveRes.json();
}

class PokeGame extends Component {
    constructor(props) {
        super(props);
        this.state = initialState
    }

    componentDidMount() {
        this.initializeGame()
    }

    static play(attackPlayer, defensePlayer, attackMove) {
        var damage = ((2 * attackPlayer.level) / 5) + 2;
        // Pokemon damage stat
        damage *= attackPlayer.pokemon.stats[5].base_stat;
        // Pokemon attack stat
        damage = damage * attackMove.power / 75 + 2;

        var modifier = Math.random() * (0.85 - 1.00) + 0.85;
        damage = (damage * modifier);
        return defensePlayer.health - damage;
    }

    toggleMove(attackMove) {
        //Player's move
        var computerDefenseHealth = PokeGame.play(this.state.player, this.state.computer, attackMove);
        if (computerDefenseHealth < 0) {
            this.setState({winner: this.state.player});
            return;
        }

        // Computer's move
        attackMove = this.state.computer.moves[Math.floor(Math.random()*NO_MOVES)];
        var playerDefenseHealth = PokeGame.play(this.state.computer, this.state.player, attackMove);
        if (playerDefenseHealth < 0) {
            this.setState({winner: this.state.computer});
            return;
        }

        // Updating game's state
        this.setState({
            player: {
                ...this.state.player,
                health: playerDefenseHealth,
            },
            computer: {
                ...this.state.computer,
                health: computerDefenseHealth,
            },
        });
    }

    onChange = (event) => {
        this.setState({player: {type: event.target.value}});
    };


     async initializeGame() {
         const pokemon = this.props.pokemon;
         console.log(pokemon);

         var sprite = pokemon.sprites.front_default;

         // If the Pokémon doesn't have a sprite, just get another Pokémon.

         var pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

         if (pokemonName.includes("-")) {
             pokemonName = pokemonName.substring(0, pokemonName.indexOf('-'));
         }

         // var moves = pokemon.moves.filter(move => move.power);
         var moves = pokemon.moves
             .map(x => ({x, r: Math.random()}))
             .sort((a, b) => a.r - b.r)
             .map(a => a.x)
             .slice(0, NO_MOVES);
         moves = await Promise.all(moves.map(move => getMoveInformation(move.move.name)));

         console.log(moves);


         //TODO: Change for computer
         this.setState({
                 move: 0,
                 player: {
                     name: "player",
                     pokeName: pokemonName,
                     sprite: sprite,
                     pokemon: pokemon,
                     moves: moves,
                     type: this.state.player.type,
                     level: 0,
                     health: 100,
                 },

                 computer: {
                     name: "computer",
                     pokeName: pokemonName,
                     pokemon: pokemon,
                     sprite: sprite,
                     moves: moves,
                     type: this.state.player.type,
                     level: 0,
                     health: 100,
                 },
                 isLoaded: true,
                 winner: null,
             }
         )
     };

    reset() {
        this.state = initialState
    }

    render() {
        return (
            <div>
                {this.state.isLoaded && !this.state.winner && (
                    <div>
                        <div>
                            <h3>{'Player picked: ' + this.state.player.pokemon.name}</h3>
                            <div>
                                <img src={this.state.player.sprite} width='200px' height='200px' margin-bottom='-50px'/>
                                <br/>
                                {this.state.player.pokeName}
                            </div>
                        </div>
                        <div>
                            {this.state.player.moves.map(move => (
                                <button key={'move' + move.id}
                                        onClick={() => this.toggleMove(move)}>{move.name}</button>
                            ))}
                        </div>
                        <div>
                            <h3>{'Players health: ' + this.state.player.health}</h3>
                            <h3>{'Computer health: ' + this.state.computer.health}</h3>
                        </div>
                    </div>
                )}

                {this.state.isLoaded && this.state.winner && (
                    <div>
                        {'Winner is: ' + this.state.winner.name}
                        <button onClick={this.props.action}>{"NEXT!"}</button>
                    </div>
                )}
            </div>
        );
    }
}

export default PokeGame;