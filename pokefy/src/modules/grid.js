import React, { Component } from 'react';
import '../App.css';
import album from '../album.jpg';
import bulba from '../bulba.png';
import char from '../char.png';
import PropTypes from 'prop-types';
import './grid.css';

class Grid extends Component{

    constructor(props) {
        super(props);

        this.state = {
            imgSrc1: album,
            imgSrc2: album,
            imgSrc3: album,
            imgSrc4: album,
            imgSrc5: album,
            imgSrc6: album,
            imgSrc7: album,
            imgSrc8: album,
            imgSrc9: album,
            imgSrc10: album,
            title: "Pick a song!",
            readyForGame: false,
            songTitle: "Killer Queen"



        };
        this.handleClick1 = this.handleClick1.bind(this);
        this.handleClick2 = this.handleClick2.bind(this);
        this.handleClick3 = this.handleClick3.bind(this);
        this.handleClick4 = this.handleClick4.bind(this);
        this.handleClick5 = this.handleClick5.bind(this);
        this.handleClick6 = this.handleClick6.bind(this);
        this.handleClick7 = this.handleClick7.bind(this);
        this.handleClick8 = this.handleClick8.bind(this);
        this.handleClick9 = this.handleClick9.bind(this);
        this.handleClick10 = this.handleClick10.bind(this);


    }
    handleClick1() {
        if (this.state.readyForGame === false) {
            this.setState({
                imgSrc1: bulba,
                title: "You got Bulbasaur!",
                readyForGame: true,
                songTitle: ""
            });
        }
    }
    handleClick2() {
        if (this.state.readyForGame === false) {
            this.setState({
                imgSrc2: char,
                title: "You got Charmander!",
                readyForGame: true,
                songTitle: ""
            });
        }
    }
    handleClick3() {
        if (this.state.readyForGame === false) {
            this.setState({
                imgSrc3: bulba,
                title: "You got Bulbasaur!",
                readyForGame: true,
                songTitle: ""
            });
        }
    }
    handleClick4() {
        if (this.state.readyForGame === false) {
            this.setState({
                imgSrc4: bulba,
                title: "You got Bulbasaur!",
                readyForGame: true,
                songTitle: ""
            });
        }
    }
    handleClick5() {
        if (this.state.readyForGame === false) {
            this.setState({
                imgSrc5: bulba,
                title: "You got Bulbasaur!",
                readyForGame: true,
                songTitle: ""
            });
        }
    }
    handleClick6() {
        if (this.state.readyForGame === false) {
            this.setState({
                imgSrc6: bulba,
                title: "You got Bulbasaur!",
                readyForGame: true,
                songTitle: ""
            });
        }
    }
    handleClick7() {
        if (this.state.readyForGame === false) {
            this.setState({
                imgSrc7: bulba,
                title: "You got Bulbasaur!",
                readyForGame: true,
                songTitle: ""
            });
        }
    }
    handleClick8() {
        if (this.state.readyForGame === false) {
            this.setState({
                imgSrc8: bulba,
                title: "You got Bulbasaur!",
                readyForGame: true,
                songTitle: ""
            });
        }
    }
    handleClick9() {
        if (this.state.readyForGame === false) {
            this.setState({
                imgSrc9: bulba,
                title: "You got Bulbasaur!",
                readyForGame: true,
                songTitle: ""
            });
        }
    }
    handleClick10() {
        if (this.state.readyForGame === false) {
            this.setState({
                imgSrc10: bulba,
                title: "You got Bulbasaur!",
                readyForGame: true,
                songTitle: ""
            });
        }
    }

    render(){
        const { tracks } = this.props;
        console.log(tracks);

        return (
            <div>
                <h3>{this.state.title}</h3>
                <button disabled={!this.state.readyForGame} onClick={this.props.action}>Start playing</button>
                <br/>
                <div className="song-grid">
                {
                    tracks.slice(0, 10).map(track => (
                        <div key={track.played_at}>
                            <img src={track.track.album.images[0].url} className="Grid-img" />
                            <h3>{track.track.name}</h3>
                        </div>
                    ))
                }
                </div>
                {/*
                <img src={this.state.imgSrc1} onClick={this.handleClick1} className="Grid-img"/>
                <h3>{this.state.songTitle}</h3>
                <img src={this.state.imgSrc2} onClick={this.handleClick2} className="Grid-img"/>
                <h3>{this.state.songTitle}</h3>
                <img src={this.state.imgSrc3} onClick={this.handleClick3} className="Grid-img"/>
                <h3>{this.state.songTitle}</h3>
                <img src={this.state.imgSrc4} onClick={this.handleClick4} className="Grid-img"/>
                <h3>{this.state.songTitle}</h3>
                <img src={this.state.imgSrc5} onClick={this.handleClick5} className="Grid-img"/>
                <h3>{this.state.songTitle}</h3>
                <br/>
                <img src={this.state.imgSrc6} onClick={this.handleClick6} className="Grid-img"/>
                <h3>{this.state.songTitle}</h3>
                <img src={this.state.imgSrc7} onClick={this.handleClick7} className="Grid-img"/>
                <h3>{this.state.songTitle}</h3>
                <img src={this.state.imgSrc8} onClick={this.handleClick8} className="Grid-img"/>
                <h3>{this.state.songTitle}</h3>
                <img src={this.state.imgSrc9} onClick={this.handleClick9} className="Grid-img"/>
                <h3>{this.state.songTitle}</h3>
                <img src={this.state.imgSrc10} onClick={this.handleClick10} className="Grid-img"/>
                */}
            </div>
        );
    }
}

export default Grid;