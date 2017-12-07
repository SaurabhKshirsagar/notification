import {Dimensions,StyleSheet,Alert} from 'react-native';
const {height,width} = Dimensions.get('screen');


let styles= StyleSheet.create({
    
    'header':{
        backgroundColor:'rgb(33, 150, 243)',
    },
    'body':{
       backgroundColor:'white',
        width,
        height:(0.9 * height )
    },
    'screen':{
        position:'absolute',
        backgroundColor:'rgb(234, 236, 251)',
        width,
        padding:2,
        height:(0.9 * height )
    },
    'Footer':{
         width,
        height:(0.1 * height )
    }
})

let tabStyles= StyleSheet.create({
    
    'header':{
        backgroundColor:'rgb(33, 150, 243)',
    },
    
    'body':{
        flex:1,
        flexDirection:'row'
    },

    'masterscreen':{
        flex:1,
        flexDirection:'row',
        backgroundColor:'white',
        width:300,
        height:(0.9 * height )
    },
    'screen':{
        flexBasis:600,
        margin:3,
        padding:2,
        backgroundColor:'rgb(234, 236, 251)',
        height:(0.9 * height )
    },

    'menu':{
        flexBasis:400,
        backgroundColor:'rgb(51, 122, 183)',
        height:(0.9 * height )
    },
    
    'Footer':{
         width,
        height:(0.1 * height )
    }
})

module.exports= {styles, tabStyles};