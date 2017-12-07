import React from "react";
import ReactDOM from 'react-dom';
import R from 'ramda';
import _ from "lodash";
import {TextInput,View} from 'react-native';
import ErrorComp from 'components/viewcomponents/errorcontrol';
import {  getField, getFormattedValue } from "appcontext";

let render = function () {
     let style=_.merge({height:40},this.props.style);
    debugger;
    let errorControl = null, formattedValue = null, compnentToRender;
    if (this.state.propLenses && this.state.propLenses.dataSource) {
        let field = this.state.propLenses.dataSource ? getField(this.state.propLenses.dataSource) : null,
            format = this.state.props.format || field.getIn(["schema", "format"])
        formattedValue = getFormattedValue(field, format);
        formattedValue = (formattedValue == null) ? "" : formattedValue;
        let {error, schema} = field.toJSON();
        errorControl = <ErrorComp field={field}></ErrorComp>;
    }

    if (this.state.inlineMode) {
        compnentToRender = this.superRender();
    }
    else
        compnentToRender =<TextInput style={style}
                            placeholder={this.state.props.label}
                            onFocus={this.onClick.bind(this) }
                            value={formattedValue}/>
 


    return <View>
    {compnentToRender}
    {errorControl}
    </View>;
}

export default render;

