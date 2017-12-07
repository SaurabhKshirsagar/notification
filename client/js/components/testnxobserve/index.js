import React from 'react';
//import observer from '@risingstack/nx-observe';
import {controlTypes} from './VacationEntity.js';
import Textbox from "./Textbox.js";



let VacationRequest = React.createClass ({

    getInitialState(){
        return({
            "empId":""
        })
    },
    componentWillMount(){
        this.setState({"controlTypes":controlTypes});
        this.context=observer.observable(this.props.$observable.$context);
        this.setStateValues();
    },
    setStateValues(){
        this.setState({
            "empId":this.context.empId
        });
    },
    onHandleChange(key,e){
        this.context[key]=e.target.value
    },
    getEmpId(ctx){
        return ctx.empId;
    },
    render(){
       return (
            <div > 
             <h2>Vacation Request</h2>
             <div style={{marginTop:"100px"}}> 
             
                <Textbox valueFun={this.getEmpId}
                         ctx={this.context} 
                         placeholder={"Enter employee id"}
                         onChange={this.onHandleChange.bind(this,"empId") } />
                
           </div>
           </div>
           )

    }
});

module.exports=VacationRequest;