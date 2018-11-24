import React, {Component} from 'react';
import bulba from "../bulba.png";

class GridItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clicked: false,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.props.readyForGame === false) {
            this.setState({
                clicked: true,
            });
        }
        this.props.moveToGame();
    }

    getImage = () => this.state.clicked ? bulba : this.props.track.track.album.images[0].url;

    render(){
        const image = this.getImage();

        return(
            <div>
                <img src={image} className="Grid-img" onClick={this.handleClick}/>
                <h3>{this.props.track.track.name}</h3>
            </div>
        )
    };
}

export default GridItem;