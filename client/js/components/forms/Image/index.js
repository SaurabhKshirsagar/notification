import React from "react";
import ReactDOM from 'react-dom';
import {Image} from 'react-bootstrap';

export default class Avatar extends React.Component {
    render() {
        let img;
        if(this.props.circle)
            img=<Image src={this.props.src} style={this.props.style} circle/>
        else
            img=<Image src={this.props.src} style={this.props.style} />

        return  (
            img
        )
    }
}
