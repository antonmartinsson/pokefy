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
      name: '',
      type: '',
      image: '',
    };
  }

  getPokemon = async (event) => {
    event.preventDefault()
    try {
        const typeRes = await getType(this.state.type)
        var pokeAmount = typeRes.pokemon.length
        var randPokemonID = Math.round(Math.random() * (pokeAmount-1) + 0)

        //Select the name of a random Pokémon from the type list
        var randPokemon = typeRes.pokemon[randPokemonID].pokemon.name
        
        // Make another API-call to get the details for that Pokémon
        const pokemon = await getDetails(randPokemon);
        var sprite = pokemon.sprites.front_default;

        // If the Pokémon doesn't have a sprite, just get another Pokémon.
        while (sprite == undefined) {
          const pokemon = await getDetails(randPokemon);
          var sprite = pokemon.sprites.front_default;
        }

        console.log(sprite);
        var pokemonCap = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        
        if (pokemonCap.includes("-")) {
          var pokemonClean = pokemonCap.substring(0, pokemonCap.indexOf('-'));
          this.setState ({
            isLoaded: true,
            name: pokemonClean,
            image: sprite
        })
        }

        else {
          this.setState ({
            isLoaded: true,
            name: pokemonCap,
            image: sprite
        })
        }
        
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
    // Create the content
    let content;
    const { error, isLoaded, items } = this.state;
    if (error) {
      content = <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      //content = <div>Loading...</div>;
    } else {
      content = (
        <div>
          <img src={this.state.image} width='200px' height='200px' margin-bottom='-50px'/>
          <br/>
          {this.state.name}
        </div>

      );
    }

    // Render the content
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