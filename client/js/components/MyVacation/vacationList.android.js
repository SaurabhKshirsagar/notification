import React from 'react';
import ContextProvider from 'components/testnxobserve/contextprovider.js';
import ContextComponent from "components/contextcomponent"
import _ from 'lodash';
import LinkToWrapper from "components/stroage/linktowrapper";

import PathComponent from 'components/MyVacation/pathComponent.js'
import NewVacation from 'components/MyVacation/NewVacation';
import {Match} from 'react-router';
import {View} from 'react-native';
import navigation from "actions/navigation";
import { Button,Text, List, ListItem } from 'native-base';
import {styles,tabStyles} from 'components/MyVacation/styles';

import MadiaQuery from 'components/MyVacation/madiaquery';

var {navigateTo} = navigation;
var {historyPop} = navigation;

class VacationsList extends ContextComponent {
    getParams(){
          let {params:{MyVacations}} = this.props;
         return {MyVacations};
	}
     navigate(path) {
        navigateTo(path)
    }
    render() {
   
            return (
                <MadiaQuery master={true}>
                        <MadiaQuery>
                        <List>
                           
                                <Button block info onPress={this.navigate.bind(this, `${this.props.pathname}/NewVacation`)}> New Vacation </Button>
                                    
                            {this.props.params.MyVacations.map((vacation, key) => {
                            return <ListItem  style={{marginLeft:0}}>
                            <View>
                                    <Text>Start Date : {vacation.startDate}</Text>
                                    <Text>End Date   : {vacation.enddate}</Text>
                                    <Text>Reason     : {vacation.reason}</Text>                        
                            </View>
                            </ListItem>
                            

                        }) }</List>
                        </MadiaQuery>
                                <PathComponent pathname={`${this.props.pathname}/NewVacation`} component={NewVacation} {...this.getContexts()} />
                        
                      </MadiaQuery>
                  
                    );
       
    }
}

export default ContextProvider(VacationsList)