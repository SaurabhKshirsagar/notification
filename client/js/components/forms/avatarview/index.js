import React from "react";
import ReactDOM from 'react-dom';
import {exEvaluator} from 'actions/exEvaluator.js';
import {Image} from 'react-bootstrap';
import { getLens, get}  from "appcontext"; 
import auth from "actions/auth";
export default class AvatarView extends React.Component {
    constructor(props){
        super(props);
         this.getDataSource=this.getDataSource.bind(this);
          this.state={
            isUser:false
         }
    }
    componentWillReceiveProps(){
        this.getDataSource();
    }
     getDataSource() {
        let {parent, context, visible} = this.props;
        if(visible){
            exEvaluator(visible, { parent, context })
                .then((result) => {
                    this.setState({isUser:result})
                });
        }
    }
    render() {
        if(this.state.isUser)
            return  <div style={this.props.style}> {this.props.children} </div>
        else 
         return  <div style={this.props.style}>
         <Image src="http://www.sbsc.in/images/dummy-profile-pic.png" 
                circle 
                style={{
                  "float" : "right",
                  "height" : "40px",
                  "margin" : "2px 19px",
                  "width" : "34px"
                }} /></div>
    }
}