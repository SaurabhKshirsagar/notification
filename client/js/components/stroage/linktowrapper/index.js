import React, {Component} from "react";
import { Link} from 'react-router';
import _ from 'lodash';
import {extendObservable} from "mobx";

export default class LinkToWrapper extends React.Component {
    constructor(props) {
        super(props);
    }
    onClick(){
        let moduleState=this.props.moduleState;
        let pathValue = this.props.to;
        localStorage.setItem(pathValue, JSON.stringify({moduleState}));  
    }
    render() {
        return (<Link to={this.props.to} onClick={this.onClick.bind(this)}>
       	{this.props.children}
        </Link>);
    }
}