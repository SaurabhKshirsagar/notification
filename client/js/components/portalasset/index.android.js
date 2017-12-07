import React, {Component} from "react";

import { MemoryRouter as Router, Match, Link} from 'react-router';
import {ReactHistory, getContext} from "components/reacthistory";
import {AppRegistry, View, Text, Alert, BackAndroid, Image} from 'react-native';
import navigation from "actions/navigation";

import { Container, Content, List, ListItem, Icon, Badge, TouchableOpacity, Button, DeckSwiper, Card, CardItem, Thumbnail } from 'native-base';
import Drawer from 'react-native-drawer';


import ContextComponent from "components/contextcomponent";

import ContextProvider from 'components/testnxobserve/contextprovider.js';
import PathComponent from 'components/MyVacation/pathComponent.js'
import VacationsList from 'components/MyVacation/vacationList'
import HoliDays from 'components/MyVacation/holidays'


import {styles, tabStyles} from 'components/MyVacation/styles'
import { MediaQuery } from "react-native-responsive";
const Entity = {
    'MyVacations': {
        "100": [
            {
                startDate: "1 Dec 2016",
                enddate: "4 Dec 2016",
                reason: "Pune"
            }
        ]
    },
    'Holidays': [
        {
            Date: "26 Jan 2017",
            Title: "republic day"
        }, {
            Date: "30 Oct 2017",
            Title: "Winter is comming"
        },
        {
            Date: "1 Dec 2017",
            Title: "Dashera"
        },
        {
            Date: "30 Dec 2017",
            Title: "New year"
        }
    ]
};

let {navigateTo, historyPop} = navigation


console.disableYellowBox = true;



class SetupComponent extends ContextComponent {
    openDrawer() {
        this._drawer.open();
    }
    navigate(path) {
        navigateTo(path);
      
    }

    getContextVars() {
        return {
            'MyVacations': Entity.MyVacations['100'],
            'Holidays': Entity.Holidays
        }
    }
    getParams() {
        let {MyVacations, Holidays} = this.state.context;
        return { MyVacations, Holidays };
    }
    render() {
        let menus=<List>
                                <ListItem  style={{marginLeft:0, backgroundColor: 'rgb(51, 122, 183)'}} onPress={this.navigate.bind(this, '/MyVacations') }>
                                            <Icon name="ios-happy" style={{width:50,color: 'white' }} />
                                            <Text  style={{ fontSize: 15, fontWeight: 'bold',color: 'white'}}>My Vacations</Text>
                                </ListItem>
                                
                                <ListItem  style={{marginLeft:0, backgroundColor: 'rgb(51, 122, 183)' }} onPress={this.navigate.bind(this, '/Holidays') }>
                                            <Icon name="ios-home" style={{width:50, color: 'white' }} />
                                            <Text  style={{ fontSize: 15, fontWeight: 'bold', color: 'white'}}>Holidays</Text>
                                </ListItem>

                                <ListItem  style={{marginLeft:0, backgroundColor: 'rgb(51, 122, 183)' }} onPress={this.navigate.bind(this, '/Holidays') }>
                                             <Icon name="md-cash" style={{width:50, color: 'white' }} />
                                            <Text  style={{ fontSize: 15, fontWeight: 'bold', color: 'white'}}>Salary</Text>      
                                </ListItem>

                                <ListItem  style={{marginLeft:0, backgroundColor: 'rgb(51, 122, 183)'}} onPress={this.navigate.bind(this, '/') }>
                                          <Icon name="ios-key" style={{width:50, color: 'white' }} />
                                         <Text  style={{ fontSize: 15, fontWeight: 'bold', color: 'white'}}>Gols</Text>    
                                </ListItem>
                               
                </List>;


        return (

            <View>

                <MediaQuery minDeviceWidth={700} maxDeviceWidth={1300}>
                    <View>
                        <View style={styles.header}>
                            <List >
                                <ListItem>
                                    <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'white', textAlign: "center" }}>p10</Text>
                                </ListItem>
                            </List>
                        </View>
                        <View style={tabStyles.body}>
                            <View style={tabStyles.menu}>
                                {menus}
                            </View>
                            <PathComponent pathname="/MyVacations" component={VacationsList} {...this.getContexts() } />
                            <PathComponent pathname="/Holidays" component={HoliDays} {...this.getContexts() } />
                        </View>
                    </View>
                </MediaQuery>

                <MediaQuery maxDeviceWidth={400}>
                    <View style={styles.body}>
                        <Drawer
                            type="overlay"
                            ref={(ref) => { this._drawer = ref } }
                            tapToClose={true}
                            openDrawerOffset={0.5}
                            panCloseMask={0.5}
                            closedDrawerOffset={-3}
                            side="left"
                            styles=  {{
                                drawer: { backgroundColor: "rgb(51, 122, 183)", shadowColor: '#000000', shadowOpacity: 0.8, shadowRadius: 3 },
                                main: { backgroundColor: 'transparent' },
                                mainOverlay: { backgroundColor: 'transparent' }
                            }}
                            content={menus}>
                            <View>
                                <View style={styles.header}>
                                    <List >
                                        <ListItem>
                                            <Button transparent iconRight  onPress={this.openDrawer.bind(this) }>
                                                <Icon name="ios-menu" />
                                            </Button>
                                            <Text style={{ flex: 2, fontSize: 25, fontWeight: 'bold', color: 'white', textAlign: "center" }}>p10</Text>
                                        </ListItem>
                                    </List>
                                </View>
                                <View style={styles.body}>
                                
                                    <PathComponent pathname="/MyVacations" component={VacationsList} {...this.getContexts() } />
                                    <PathComponent pathname="/Holidays" component={HoliDays} {...this.getContexts() } />
                                </View>
                            </View>

                        </Drawer>
                    </View>
                </MediaQuery>

            </View>
        )

    }
}

export default ContextProvider(SetupComponent);