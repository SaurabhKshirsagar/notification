import React from 'react';
import ContextProvider from 'components/testnxobserve/contextprovider';
import ContextComponent from "components/contextcomponent"
import _ from 'lodash';
import {Button} from 'react-bootstrap';
import {AppRegistry, View, Alert, BackAndroid , Image} from 'react-native';
import {Text, List, ListItem } from 'native-base';
import {styles, tabStyles} from 'components/MyVacation/styles'

import MadiaQuery from 'components/MyVacation/madiaquery';
class Holidays extends ContextComponent {
    getParams(){
          let {params:{Holidays}} = this.props;
         return {Holidays};
	}
    render() {
        
            return (   <MadiaQuery master={true}>
                            <MadiaQuery>
                                <List>
                           
                                    
                            {this.props.params.Holidays.map((Holiday, key) => {
                            return <ListItem  style={{marginLeft:0}}>
                            <View>
                                    <Text>{Holiday.Title}</Text>
                                    <Text note>Date   : {Holiday.Date}</Text>
                                                 
                            </View>
                            </ListItem>
                            

                        }) }</List>
                           </MadiaQuery>
                        </MadiaQuery>);
      
    }
}

export default ContextProvider(Holidays)