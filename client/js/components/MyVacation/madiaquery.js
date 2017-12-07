import React from 'react';
import {View, Text} from 'react-native';
import {styles,tabStyles} from 'components/MyVacation/styles'
import { MediaQuery } from "react-native-responsive";
import  {Device} from "react-native-responsive";

class MadiaQuery extends React.Component {
            constructor(props){
        super(props);

    }
    componentWillMount(){
           
           let d= Device;
            let m=MediaQuery
           let device = new Device({minDeviceWidth:700,maxDeviceWidth:1300})
           if(device.isValid()){
                   if(this.props.master)
                        this.style=tabStyles.masterscreen
                        else
                        this.style=tabStyles.screen;
           }else{
             this.style=styles.screen;
           }
    }
    render() {
            return (
                     <View style={this.style}>
                            {this.props.children}
                    </View>
              );
       
    }
}

export default MadiaQuery;