
import React from 'react';
import repeatableViewGenerater from "components/repeatableviewgenerater";
import { onProcessActions, exEvaluator } from "actions/exEvaluator.js";
import LabelComp from '../labelcomp.js';
import View from '../view';
import { Button, FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap';

let onChange=function(e){
this.props.onSelectionChanged(this.props.context,this.props.params,null,e.target.value)
}

let renderDropdown = (thisReference, listItems) => {
    return (
        <div style={thisReference.props.style}>
            <FormGroup controlId="formControlsSelect">
                    <ControlLabel>Select</ControlLabel>
                    <FormControl onChange={onChange.bind(thisReference)} componentClass="select"  placeholder="select">
                        {listItems}
                    </FormControl>
            </FormGroup>
        </div>
    );
},
/*click = function(thisReference,key, item,ds) {
    thisReference.props.onSelectionChanged(thisReference.props.context,thisReference.props.params,key,item,ds)
},*/
renderChildItem = (thisReference, item, key, ds) => {
        return <option key={key} selected={thisReference.state.props?(thisReference.state.props.value==item):false} value={item}>{item}</option>;//<View>{item}</View>
},
renderChildWrapper = (thisReference, item,element, key, ds) => element;


export default repeatableViewGenerater("DropdownControl", renderDropdown, renderChildItem, null, null, renderChildWrapper);

