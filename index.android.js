

import React, {Component} from "react";
import { MemoryRouter as Router, Match,Link} from 'react-router';
import {ReactHistory,getContext} from "components/reacthistory";
import {AppRegistry, View, Text, Alert, BackAndroid , Image ,AppState } from 'react-native';
import navigation from "actions/navigation";
import PortalAsset from "components/portalasset"
import { Container, Content, Button, Icon } from 'native-base';


import io from 'socket.io-client/dist/socket.io.js';

import PushNotification from 'react-native-push-notification';
PushNotification.configure({  
    onNotification: function(notification) {
        console.log( 'NOTIFICATION:', notification );
    }
});


let {browseTo,historyPop,navigateTo} = navigation;


let token='eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSIsImtpZCI6ImEzck1VZ01Gdjl0UGNsTGE2eUYzekFrZnF1RSJ9.eyJpc3MiOiJodHRwczovL2F1dGguYml0cG9kLmlvL2F1dGgiLCJhdWQiOiJodHRwczovL2F1dGguYml0cG9kLmlvL2F1dGgvcmVzb3VyY2VzIiwiZXhwIjoxNDg0NzE4MjYzLCJuYmYiOjE0ODQ2MzE4NjMsImNsaWVudF9pZCI6IkU3bHdFOGU4cFRtelVPRVlPc05NZjE1TW1LSXFxUi9DL1kyRTZLNmtGdEU9Iiwic2NvcGUiOlsicHJvZmlsZSIsIm9wZW5pZCIsImVtYWlsIl0sInN1YiI6IjQ5MSIsImF1dGhfdGltZSI6MTQ4NDYzMDYxMSwiaWRwIjoicDEwT0F1dGgiLCJhbXIiOlsicDEwT0F1dGgiXX0.QZmkRFmv2Weh4W9NYCLcYfBJKlSMpW6tiU9AA3-1DTyoCjgAoylqMUIZ6sgaYIqrGekKsHaKuTM8l2BAEg5lRISVyEOqtn9c_zP8_hi5qUa8-iExJDja4DukZ84gtzRq7U7n0lVIRbTpu9tqhmzHjf7jlqDvAEf2ii4d84My4i4UoRAtEpnPoWQZa8blD4RDysej6LZtUDCpu5waVnDKy-kDapvlGmVmpn8HOFHXerJlN3ZO9-rXw47SM9_iXIFJmP_6QeT5hDr69qQDTzVxvufRXc1vopJt_9KwsjD8zIcApsTe-Os_wQPTV0gOHYB2nE80vXykGZin1OCeX_TNXA';


var socket = io.connect("http://192.168.1.109:8082",{query:"token="+token}) 

console.disableYellowBox = true;


class App extends React.Component {
   constructor(props){
    super(props)
        this.appStateChange= this.appStateChange.bind();
    }
    componentDidMount(){
        AppState.addEventListener('change', this.appStateChange)

            socket.on('notification',function(data){
                let stringData=JSON.stringify(data)
            Alert.alert("notify",stringData);
        }); 
    }
    componentWillUnmount(){
        AppState.addEventListener('change', this.appStateChange)
    }
    appStateChange(appState){
        if(appState == 'background'){

        socket.on('notification',function(data){
                let stringData=JSON.stringify(data)
            PushNotification.localNotificationSchedule({
                title: "New Message",
                message: stringData,
                date: new Date(Date.now())
            })
        }); 
   
          
        }
    }
    render() {
        
        BackAndroid.addEventListener('BackPress', () => {historyPop(); return true;});
        return <Router>
            <ReactHistory>
            <View style={{flex:1}}>
                <PortalAsset/>
            </View>
            </ReactHistory>
        </Router>;
    }
}

AppRegistry.registerComponent("Screens", () => App);


