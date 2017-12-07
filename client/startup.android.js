// import Promise from "bluebird";
import React, {Component} from "react";
import {AppRegistry, View, Text} from 'react-native';

//add more libraries.
import {db} from "engine/db";
import app from "engine/app";
import {auth} from "engine/Auth";


console.disableYellowBox = true;
class SetupComponent extends Component{
    constructor(props){
        super(props);
        this.state = {"AppView" : null};
    }
    setAppView(appView){
        this.setState({"AppView" : appView});
    }
    componentDidMount(){
        db.setup().then(auth.setup).then(app.setup(this.setAppView.bind(this)));
    }
    render(){
        if (this.state.AppView){
            let {AppView} = this.state;
            return AppView;
        }
        return <View><Text>Loading....</Text></View>;
    }
}

AppRegistry.registerComponent("helloNative", ()=>SetupComponent);