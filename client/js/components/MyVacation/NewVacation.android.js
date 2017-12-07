import React from 'react';
import ContextProvider from '../testnxobserve/contextprovider';
import ContextComponent from "components/contextcomponent"

import {Match} from 'react-router';
import {View, Text} from 'react-native';

import {  List, ListItem } from 'native-base';

import Textbox from '../testnxobserve/Textbox';
import DateControl from '../testnxobserve/datecomp';
import Button from '../testnxobserve/Button';

import navigation from "actions/navigation";
import {styles, tabStyles} from 'components/MyVacation/styles'

import MadiaQuery from 'components/MyVacation/madiaquery';

let {navigateTo, historyPop} = navigation
class NewVacation extends ContextComponent {
    getContextVars() {
        return {
            'Vacations': {
                startDate: '',
                enddate: '',
                reason: ''
            }
        }
    }
    getParams() {
        let {params: {MyVacations}} = this.props;
        return { MyVacations };
    }
    newVacation() {
        this.props.params.MyVacations.push(Object.assign({}, this.state.context.Vacations));
        navigateTo(`/MyVacations`)
    }
    render() {
        return   <MadiaQuery>
                    <Text>Start Date</Text>
                    <DateControl
                        mapContextToProps={($context, $params) => {

                            return {
                                "value": $context.Vacations.startDate
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
                    <Text>End Date</Text>
                    <DateControl placeholder="key"
                        mapContextToProps={($context, $params) => {
                            return {
                                "value": $context.Vacations.enddate
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
                    <Text>Reason</Text>
                    <Textbox placeholder="key"
                        mapContextToProps={($context, $params) => {
                            return {
                                "value": $context.Vacations.reason,
                                "placeholder": 'Reason'
                            }
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
                    <Text> </Text>
                    <Button
                        mapContextToProps={($context, $params) => {
                            return {
                                "block":'block',
                                "info":'info'
                            }
                        }
                        }
                        onSubmit={ ($context, $params, prop, value) => {
                            $params.MyVacations.push(Object.assign({}, $context.Vacations));

                            navigateTo(`/MyVacations`)
                        } }
                        {...this.getContexts() }>
                        Add
                    </Button>
            </MadiaQuery>    
         
    }
}

export default ContextProvider(NewVacation)