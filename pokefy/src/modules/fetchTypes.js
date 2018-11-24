import React from 'react';
import '../App.css';

async function getType(type) {
    const typeRes = await fetch('http://pokeapi.co/api/v2/type/' + type)
    return await typeRes.json();
}

async function getDetails(randPokemon) {
    const pokemonRes = await fetch('http://pokeapi.co/api/v2/pokemon/' + randPokemon)
    return await pokemonRes.json();
}


class TypeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      type: '',
    };
  }

  getPokemon = async (event) => {
    event.preventDefault();
    const typeRes = await getType(this.state.type);
    var pokeAmount = typeRes.pokemon.length;
    var randPokemonID = Math.round(Math.random() * (pokeAmount - 1));
    var randPokemon = typeRes.pokemon[randPokemonID].pokemon.name;

    const pokemon = await getDetails(randPokemon);
    console.log(pokemon);
      
  };

  onChange = (event) => {
    this.setState({type: event.target.value});
  };

  render() {
    let content;
    const { error, isLoaded, items } = this.state;
    if (error) {
      content = <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      content = <div>Loading...</div>;
    } else {
      content = (
        <div>{items.name}</div>
      );
    }

    return (
        <div>
            <form onSubmit={this.getPokemon}>
                <input onChange={this.onChange} value={this.state.type} type="text" id="type" />
            </form>

        </div>
    )
  }
}

export default TypeComponent;