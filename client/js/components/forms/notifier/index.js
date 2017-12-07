import React from "react";
import ReactDOM from 'react-dom';
import {exEvaluator} from 'actions/exEvaluator.js';


export default class Notify extends React.Component {
    constructor(props){
        super(props);
         this.getDataSource=this.getDataSource.bind(this);
          this.state={
             dataSourceProp:null
         }
    }
     getDataSource() {
        let {parent, context,dataSource,label} = this.props;
        if(dataSource){
            exEvaluator(dataSource, { parent, context })
                .then((pInstance) => {
                    this.setState({"dataSourceProp":pInstance});
                });
        }
    }
    render() {
    
        let {parent, context} = this.props;
        let {dataSourceProp}=this.state;
        let alerts;
        if(dataSourceProp){
            let lens = getLens(dataSourceProp, { parent, context });
            alerts=get(lens)
            return  <div style={this.props.style}>{alerts}</div>
        }
        else 
         return ""
    }
}