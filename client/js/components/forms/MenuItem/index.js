import React from "react";
import ReactDOM from 'react-dom';
import {MenuItem} from 'react-bootstrap';
import {exEvaluator,onProcessActions} from 'actions/exEvaluator.js';
import { getLens, get}  from "appcontext"; 

 class Menu_Item extends React.Component {
    constructor(props,context){
        super(props);
         this.getDataSource=this.getDataSource.bind(this);
         this.state={
             label:"",
             dataSourceProp:null
         }
    }
    componentWillMount(){
        this.getDataSource();
    }
    handleClick(e) {
        let {parent, context, actions: {click}} = this.props;
        onProcessActions(click, { parent, context});
    }
     getDataSource() {
        let {parent, context,dataSource,label} = this.props;
        if(dataSource){
            exEvaluator(dataSource, { parent, context })
                .then((pInstance) => {
                    this.setState({"dataSourceProp":pInstance});
                });
        }else{
            this.setState({"label":label})
        }
    }
    render() {
        let {parent, context} = this.props;
        let {label,dataSourceProp}=this.state;
        if(dataSourceProp){
            let lens = getLens(dataSourceProp, { parent, context });
            label = get(lens);
        }
        return <MenuItem href={this.props.href} onClick={this.handleClick.bind(this)}>
                {label}
            </MenuItem>
    }
}



export default Menu_Item;