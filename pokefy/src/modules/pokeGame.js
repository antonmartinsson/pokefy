import React, {Component} from 'react';
import '../App.css';


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

async function getType(type) {
    const typeRes = await fetch('http://pokeapi.co/api/v2/type/' + type);
    return await typeRes.json();
}

async function getDetails(randPokemon) {
    const pokemonRes = await fetch('http://pokeapi.co/api/v2/pokemon/' + randPokemon);
    return await pokemonRes.json();
}

async function getMoveInformation(moveID) {
    const moveRes = await fetch('https://pokeapi.co/api/v2/move/' + moveID);
    return await moveRes.json();
}

class PokeGame extends Component {
    constructor(props) {
        super(props);
        this.state = initialState
    }

    play(attackPlayer, defensePlayer, attackMove) {
        var damage = ((2 * attackPlayer.level) / 5) + 2;
        // Pokemon damage stat
        damage *= attackPlayer.pokemon.stats[5].base_stat;
        // Pokemon attack stat
        damage *= attackMove.power;
        damage /= 100;
        damage += 2;

        var modifier = Math.random() * (0.85 - 1.00) + 0.85;
        damage = (damage * modifier);

        var defensiveHealth = defensePlayer.health - damage;

        if (defensiveHealth < 0) {
            this.setState({
                winner: attackPlayer,
            })
        }

        this.setState({
            player: {
                ...this.state.player,
                health: attackPlayer.name === 'player' ? this.state.player.health : defensiveHealth
            },
            computer: {
                ...this.state.computer,
                health: attackPlayer.name === 'computer' ? this.state.computer.health : defensiveHealth
            },
        });
    }

    toggleMove(attackMove) {
        //Player's move
        this.play(this.state.player, this.state.computer, attackMove);

        if (this.state.winner) return;
        // Computer's move
        this.play(this.state.computer, this.state.player, attackMove);
    }

    onChange = (event) => {
        this.setState({player: {type: event.target.value}});
    };


    getPokemon = async (event) => {
        event.preventDefault();
        const typeRes = await getType(this.state.player.type);
        var pokeAmount = typeRes.pokemon.length;
        var randPokemonID = Math.round(Math.random() * (pokeAmount - 1));
        var randPokemon = typeRes.pokemon[randPokemonID].pokemon.name;

        const pokemon = await getDetails(randPokemon);
        console.log(pokemon);


        // var moves = pokemon.moves.filter(move => move.power);
        const n = 4;
        var moves = pokemon.moves
            .map(x => ({x, r: Math.random()}))
            .sort((a, b) => a.r - b.r)
            .map(a => a.x)
            .slice(0, n);
        moves = await Promise.all(moves.map(move => getMoveInformation(move.move.name)));

        console.log(moves);


        //TODO: Change for computer
        this.setState({
                move: 0,
                player: {
                    name: "player",
                    pokemon: pokemon,
                    moves: moves,
                    type: this.state.player.type,
                    level: 0,
                    health: 100,
                },

                computer: {
                    name: "computer",
                    pokemon: pokemon,
                    moves: moves,
                    type: this.state.player.type,
                    level: 0,
                    health: 100,
                },
                isLoaded: true,
            }
        )
    };

    reset() {
        this.state = initialState
    }

    render() {
        return (
            <div>
                <form onSubmit={this.getPokemon}>
                    <input onChange={this.onChange} value={this.state.player.type || ""} type="text" id="type"/>
                </form>
                {this.state.isLoaded && !this.state.winner && (
                    <div>
                        <div>
                            <h3>{'Player picked: ' + this.state.player.pokemon.name}</h3>
                        </div>
                        <div>
                            {this.state.player.moves.map(move => (
                                <button key={'move' + move.id}
                                        onClick={() => this.toggleMove(move)}>{move.name}</button>
                            ))}
                        </div>
                        <div>
                            <h3>{'Players health: ' + this.state.player.health}</h3>
                            <h3>{'Computer health: ' + this.state.player.health}</h3>
                        </div>
                    </div>
                )}

                {this.state.isLoaded && this.state.winner && (
                    <div>
                        {'Winner is: ' + this.state.winner.name}
                    </div>
                )}
            </div>
        );
    }
}

export default PokeGame;