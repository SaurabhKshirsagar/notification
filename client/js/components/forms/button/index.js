import React from "react";
import ReactDOM from 'react-dom';
import {Button,FormGroup} from 'react-bootstrap';
import {onProcessActions} from 'actions/exEvaluator.js';
import ErrorHandler from 'components/errorhandler'
import MyErrorHandler from 'components/myerrorhandler'


 class FormButton extends React.Component {
      constructor (props,context) {
        super(props);
      }
    getComponentLenses(){
        return [];
    }
    handleClick(e) {
        let {context, params, actions: {click}} = this.props;
        onProcessActions(click, {context, params });
    }
    render() {
        let {label, actions} = this.props;
        return  <Button bsStyle={this.props.bsStyle} onClick={this.handleClick.bind(this)} bsSize={this.props.bsSize} style={this.props.style}>{label}</Button>;
    }
}


export default ErrorHandler(React, MyErrorHandler)(FormButton);
