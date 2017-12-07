import { Component } from 'react';
import React from 'react';
import ContextComponent from "components/contextcomponent";
import {autorun, observable, toJS} from 'Mobx';
import ContextProvider from '../testnxobserve/contextprovider.js';

//temporary



import { BrowserRouter as Router, Match,Link} from 'react-router';
import LinkToWrapper from "components/stroage/linktowrapper";
import modules from "components/stroage/module";
import {ReactHistory,getContext} from "components/reacthistory";
import {Button,FormGroup,ControlLabel,FormControl} from 'react-bootstrap';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import testJson from './testJson';

import PathComponent from 'components/MyVacation/pathComponent.js'

import VacationsList from 'components/MyVacation/vacationList'
import HoliDays from 'components/MyVacation/holidays.js'

const Entity = {
    'MyVacations':{
                    "100":[
                            {
                                startDate:"1 Dec 2016",
                                enddate:"4 Dec 2016",
                                reason:"Pune"
                            },
                            {
                                startDate:"30 Dec 2016",
                                enddate:"1 Jan 2017",
                                reason:"New year"
                            },
                            {
                                startDate:"2 Feb 2017",
                                enddate:"2 Feb 2017",
                                reason:"Going Home"
                            },
                            {
                                startDate:"30 Oct 2016",
                                enddate:"30 Oct 2016",
                                reason:"Wedding"
                            }
                            ]
        },
        'Holidays':[
                            {
                                Date:"26 Jan 2017",
                                Title:"republic day"
                            },{
                                Date:"30 Oct 2017",
                                Title:"Winter is comming"
                            },
                            {
                                Date:"1 Dec 2017",
                                Title:"Dashera"
                            },
                            {
                                Date:"30 Dec 2017",
                                Title:"New year"
                            }
                            ]
};
 


class PortalAsset extends ContextComponent {
    getContextVars() {
        return {
            'MyVacations':Entity.MyVacations['100'],
            'Holidays':Entity.Holidays
            }
        }
    getParams(){
         let {MyVacations,Holidays} = this.state.context;
         return {MyVacations,Holidays};
	}
    render() {
        return (
             <div>
                <div  style={{height:"8vh", width:"100%", backgroundColor:'#2196f3', color:'white',fontSize:'xx-large'}}>
                    p10
                </div>
                <div  style={{display:"flex"}} >
                       <div  style={{height:"92vh", width:"15%", backgroundColor:'#337ab7'}} > 
                            <LinkToWrapper to= "/MyVacations" moduleState={Entity.MyVacations['100']}>
                                <Button className="btn btn-primary"  style={{width:"100%"}} > My Vacations</Button>
                            </LinkToWrapper>
                            <LinkToWrapper to= "/Holidays" moduleState={Entity.Holidays}>
                                <Button className="btn btn-primary" style={{width:"100%"}} >Holidays</Button>
                            </LinkToWrapper>
                              <LinkToWrapper to= "/Holidays" moduleState={Entity.Holidays}>
                                <Button className="btn btn-primary" style={{width:"100%"}} >Salary</Button>
                            </LinkToWrapper>
                              <LinkToWrapper to= "/" moduleState={Entity.Holidays}>
                                <Button className="btn btn-primary" style={{width:"100%"}} >Goals</Button>
                            </LinkToWrapper>
                      </div>
                        <div style={{height:"92vh", width:"85%", display:"flex"}}> 
                            <PathComponent pathname="/MyVacations" component={VacationsList} {...this.getContexts()} />            
                            <PathComponent pathname="/Holidays" component={HoliDays} {...this.getContexts()} />
                        </div>                    
                </div>
             </div>)
    }
}
export default ContextProvider(PortalAsset);


