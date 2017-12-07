
//import {Button, FormGroup, ControlLabel, FormControl, Checkbox} from 'react-bootstrap';
import React from 'react';
import ErrorComp from 'components/viewcomponents/errorcontrol';
import {Switch, Text, View, StyleSheet} from 'react-native';
//import "../../../../styles/styles.css";

import Label from "components/label";

let render = function () {
    let label = this.state.props.label,
        control = null, hide = { "display": "none" }, display = { "display": "" },
        visible = this.state.props.visible,
        value = this.state.props.dataSource ? true : false,
        readOnly = this.state.props.readOnly,
        labelPosition = this.state.props.labelPosition;
    visible = !visible || visible == "undefined" ? hide : display;
    if (this.error)
        control = <ErrorComp errorMessage={this.error.message}></ErrorComp>

    let toggleControl = <Switch
        key="t"
        value={value}
        disabled={readOnly}
        ref="formcontrol"
        onClick={this.implicitActions.onClick.bind(this) }
        onFocus={this.implicitActions.onFocus.bind(this) }
        onBlur={this.implicitActions.onBlur.bind(this) }
        onValueChange ={this.implicitActions.onChange.bind(this)}
         />
    let labelControl = <Text> {label} </Text>;

    return  <View>{(labelPosition == "before") ? [labelControl, toggleControl] : [toggleControl, labelControl]}</View> 
    
}

export default render;