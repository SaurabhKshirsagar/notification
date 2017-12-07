import React from "react";
import ReactDOM from 'react-dom';
let history=null;
let context=null;
let gethistory=function(){
    return history;
}
let getContext=function(){
    return context;
}
 class ReactHistory extends React.Component {
      constructor (props,context) {
        super(props);
      }
      componentWillMount(){
        history=this.context.history;
        context=this.context;
      }
    render() {
        return React.Children.only(this.props.children);
    }
}
ReactHistory.contextTypes = {
  history: React.PropTypes.object.isRequired,
  router: React.PropTypes.object.isRequired
};

module.exports={gethistory,ReactHistory,getContext}