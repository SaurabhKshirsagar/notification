import React from "react";
import ReactDOM from 'react-dom';
import { Link } from 'react-router';



export default class Links extends React.Component {

    render() {
        return (
                <Link to={this.props.to}>{this.props.text}</Link>
        );
    }
}
