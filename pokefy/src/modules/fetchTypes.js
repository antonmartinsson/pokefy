import React, { Component } from 'react';
import '../App.css';

async function getType(type) {
    const typeRes = await fetch('http://pokeapi.co/api/v2/type/' + type)
    const json = await typeRes.json();
    return json;
}

async function getDetails(randPokemon) {
    const pokemonRes = await fetch('http://pokeapi.co/api/v2/pokemon/' + randPokemon)
    const json = await pokemonRes.json();
    return json;
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
    event.preventDefault()
    try {
        const typeRes = await getType(this.state.type)
        var pokeAmount = typeRes.pokemon.length
        var randPokemonID = Math.round(Math.random() * (pokeAmount-1) + 0)
        var randPokemon = typeRes.pokemon[randPokemonID].pokemon.name
        const pokemon = await getDetails(randPokemon);
        console.log(pokemon);
        
        this.setState ({
            isLoaded: true,
            items: pokemon
        })
    }
    catch(error) {
        console.log(error);
        this.setState ({
            isLoaded: true,
            error
        })
    }

      
  }

  onChange = (event) => {
    this.setState({type: event.target.value});
  }

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
            {content}
        </div>
    )
  }
}

export default TypeComponent;