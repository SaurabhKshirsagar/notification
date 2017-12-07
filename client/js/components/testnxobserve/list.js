import React from 'react';
import repeatableViewGenerater from "components/repeatableviewgenerater";
import { onProcessActions, exEvaluator } from "actions/exEvaluator.js";
import LabelComp from './labelcomp.js';
import View from './view';

let renderList = (thisReference, listItems) => {
    return (
        <div style={thisReference.props.style}>
            {listItems}
        </div>
    );
},
click = function(thisReference,key, item,ds) {
    thisReference.props.onSelectionChanged(thisReference.props.context,thisReference.props.params,key,item,ds)
},
renderChildItem = (thisReference, item, key, ds) => {
        return <View>{item}</View>
},
renderChildWrapper = (thisReference, item,element, key, ds) => {
  
    let selectedItem=thisReference.state.props?(thisReference.state.props.value==item):false;
    return (
        <div style={{backgroundColor:(selectedItem?"orange":'')}} onClick={click.bind(null, thisReference,key, item,ds)}>
        {element}
        </div>
    );
}

export default repeatableViewGenerater("List", renderList, renderChildItem, null, null, renderChildWrapper);

