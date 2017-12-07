import React from 'react';
import repeatableViewGenerater from "helpers/repeatableviewgenerater";
import AssetComponent from "components/assetcomponent";
import { onProcessActions, exEvaluator } from "actions/exEvaluator.js";
import { set, getLens, Prop } from "appcontext";

let renderList = (thisReference, listItems) => {
    return (
        <div style={thisReference.props.style}>
            {listItems}
        </div>
    );
},
click = (thisReference, value) => {
    if (!thisReference.state.propLenses.selectedItem) {
        return;
    }
    let {context, parent, actions: {itemClick}} = thisReference.props;
    set(thisReference.state.propLenses.selectedItem, value);
},
renderChildItem = (thisReference, value, key, ds) => {
    let {children} = thisReference.props,
        item = children[0];
    return <AssetComponent asset={item} />;
},
renderChildWrapper = (thisReference, value, element) => {
    return (
        <div  onClick={click.bind(null, thisReference, value)} >
        {element}
        </div>
    );
},
getComponentProps = (thisReference) => {
    return {
        selectedItem: null
    };
};

export default repeatableViewGenerater("List", renderList, renderChildItem, null, getComponentProps, renderChildWrapper);
