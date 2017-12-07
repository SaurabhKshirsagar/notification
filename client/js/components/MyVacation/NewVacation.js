import React from 'react';
import ContextProvider from '../testnxobserve/contextprovider.js';
import ContextComponent from "components/contextcomponent"
import {FormGroup,ControlLabel,FormControl} from 'react-bootstrap';
import Textbox from '../testnxobserve/Textbox.js';
import DateControl from '../testnxobserve/datecomp.js';

import Button from '../testnxobserve/Button.js';
import {navigateTo} from 'actions/navigation';
class NewVacation extends ContextComponent {
    getContextVars() {
        return {
            'Vacations': {
                startDate:'',
                enddate:'',
                reason:''
            }
        }
    }
       getParams(){
          let {params:{MyVacations}} = this.props;
         return {MyVacations};
	}

    render() {        
            return (<div style={{overflow:'auto',backgroundColor:'#f5f5f5', height: "92vh", width:"30%",margin:'5px',padding:'3px'}}>
                <h5>Start Date</h5>
                <DateControl 
                    mapContextToProps={($context, $params) => {
                      
                        return { "value": $context.Vacations.startDate
                                }
                    }
                    }
                    onContextPropChange={($context, $params, prop, value) => {
                        switch (prop) {
                            case "value": {
                                $context.Vacations.startDate = value;
                                break;
                            }
                        }
                    }
                    }
                    {...this.getContexts() }
                    />
                <h5>End Date</h5>
                <DateControl placeholder="key"
                    mapContextToProps={($context, $params) => {
                        return { "value": $context.Vacations.enddate
                                }
                    }
                    }
                    onContextPropChange={($context, $params, prop, value) => {
                        switch (prop) {
                            case "value": {
                                $context.Vacations.enddate = value;
                                break;
                            }
                        }
                    }
                    }
                    {...this.getContexts() }
                    />
                <h5>Reason</h5>
                <Textbox placeholder="key"
                    mapContextToProps={($context, $params) => {
                        return { "value": $context.Vacations.reason,
                    "placeholder":'Reason' }
                    }
                    }
                    onContextPropChange={($context, $params, prop, value) => {
                        switch (prop) {
                            case "value": {
                                $context.Vacations.reason = value;
                                break;
                            }
                        }
                    }
                    }
                    {...this.getContexts() }
                    />
                <Button  
                  mapContextToProps={($context, $params) => {
                        return {'style':{ marginBottom: "5%", width: "100%" } }
                    }
                    }
                    onSubmit={ ($context, $params, prop, value) => { $params.MyVacations.push(Object.assign({},$context.Vacations));
                  
                    navigateTo(`/MyVacations`)} }
                    {...this.getContexts() }>
                    Add
                </Button>
               
            </div>);
        
    }
}

export default ContextProvider(NewVacation)