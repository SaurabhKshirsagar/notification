

import React from 'react';
import ContextProvider from '../testnxobserve/contextprovider.js';
import ContextComponent from "components/contextcomponent"
import LabelComp from '../testnxobserve/labelcomp.js';
import Textbox from '../testnxobserve/Textbox.js';

class Employee extends ContextComponent{
   	getParams(){
         let {employee} = this.props;
         return {employee};
	}
	render(){
		return <div><LabelComp mapContextToProps={
			($context, $params)=>{
                
				return{"value" : $params.employee.name}
			}
		}

		{...this.getContexts()}
		/>
        <Textbox mapContextToProps={
			($context, $params)=>{
                
				return{"value" : $params.employee.name}
			}
		}
        onContextPropChange={
                               ($context,$params, prop, value) => {
                                                            switch(prop){
                                                                    case "value": {
                                                                            $params.employee.name = value;
                                                                            break;
                                                                            }
                                                            }
                                                    }
                                    }
		{...this.getContexts()}
		/></div>
	}
}
export default ContextProvider(Employee);