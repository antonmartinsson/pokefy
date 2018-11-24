import React, { Component } from 'react';
import '../App.css';
import GridItem from "./grid-item";

class Grid extends Component{

    constructor(props) {
        super(props);

        this.state = {
            readyForGame: false,

        };

    }

    render(){
        const { tracks } = this.props;
        console.log(tracks);

        return (
            <div>
                <h3>{this.state.title}</h3>
                <br/>
                <div className="song-grid">
                {
                    tracks.slice(0, 10).map(track => (
                            <GridItem track={track} key={track.played_at} moveToGame={this.props.action} ready={this.props.readyForGame}/>
                    ))
                }
                </div>
            </div>
        );
    }
}

export default Grid;