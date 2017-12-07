import React from 'react';
import repeatableViewGenerater from "components/repeatableviewgenerater";
//import AssetComponent from "components/assetcomponent";
import { onProcessActions, exEvaluator } from "actions/exEvaluator.js";
//import { set, getLens, Prop } from "appcontext";
import ReactDOM from 'react-dom';
import {Button, FormGroup, ControlLabel, FormControl, option} from 'react-bootstrap';
//import applicationContextProvider from "engine/App/applicationContextProvider.js";
//import DataSourceBoundControl from 'components/viewcomponents/datasourceboundcontrol';
import R from "ramda";
//import {getField, getFormattedValue} from "appcontext";
//import ErrorComp from "../errorcontrol";
//import ActionBoundControl from 'components/actionboundcontrol';
//import {ActionKeys} from "helpers/implicitactions";
//import extendedAssetComponent from "components/AssetComponent/extendedAssetComponent.js";
//import createListItemWrapper from "components/list/createListItemWrapper.js";
import "./style.css";
import classNames from "classnames";


let clickdropdown=function(e){
    this.setState({
        isOpen: !this.state.isOpen
      })
},
getDropdownOptions=function(thisReference,dropDownOptions){
;
let optionObj={"value":null,"opts":[]};
    dropDownOptions.map(
    (item)=>
        {
             item.props.value==thisReference.state.selected? optionObj["value"]=item:optionObj["opts"].push(item)
          // item.props.value==thisReference.state.selected? optionObj["value"]=item:optionObj["opts"].push(item)
        }
    );
return optionObj;
},
renderDropdown = function (thisReference, dropDownOptions) {
    let label = "dropdown",//thisReference.state.props.label,
        control = null,
        optionsObj=getDropdownOptions(thisReference,dropDownOptions),
        value = (<div className="Dropdown-placeholder">
                    {optionsObj && optionsObj.value?optionsObj.value:"select"}
                 </div>);
        //readOnly = thisReference.state.props.readOnly;
    
    if (thisReference.error)
        control =<div />// (<ErrorComp errorMessage={thisReference.error.message}></ErrorComp>);

    let dropdownClass = classNames({
      ["Dropdown-root"]: true,
      'is-open': thisReference.state.isOpen
    });

    dropDownOptions=thisReference.state.isOpen && optionsObj && optionsObj.opts?optionsObj.opts:null;
    return (<div style={thisReference.props.style}>
                <FormGroup controlId="formControlsSelect">
                    <ControlLabel>{label}</ControlLabel> 
                    <div className={dropdownClass} onClick={clickdropdown.bind(thisReference)}>
                        <div className="Dropdown-control"  
                             onClick={clickdropdown.bind(thisReference)} 
                            >
                            {value}
                            <span className="Dropdown-arrow" />
                        </div>
                        <div className="Dropdown-menu">{dropDownOptions}</div>
                    </div>
                </FormGroup>
            </div>);
},
click = (thisReference,key, valueField,displayField,ds) => {
    thisReference.props.onSelectionChanged(thisReference.props.context,thisReference.props.params,key,valueField,ds);
    thisReference.setState({"selected":valueField});
   /* let pathComponent = thisReference.refs[key],
    lazyComponent = pathComponent.getComponent(),
    childComponent = lazyComponent.getComponent(),
    listItemValue = childComponent.getListItemValue();

    let {context} = thisReference.props,
    proplenses=thisReference.state.propLenses;

    if (!proplenses.selectedItem || !proplenses.selectedKey ) {
       let selectedKeyVar=proplenses.selectedKey?
                          proplenses.selectedKey:
                          getLens(context.key+"._selectedItemKey"),
           selectedItemVar=proplenses.selectedItem?
                        proplenses.selectedItem:
                        getLens(context.key+"._selectedItem");
           set(selectedItemVar, listItemValue);
           set(selectedKeyVar, key);
       return;
    }
    
  
    set(proplenses.selectedItem, listItemValue);
    set(proplenses.selectedKey, key);
    thisReference.setState({"selected":key});*/
},
/*
 implicitActionsToCreate = [ActionKeys.onChange,
                        ActionKeys.onBlur,
                        //ActionKeys.onClick,
                        ActionKeys.onFocus
],*/

renderItems=function(thisReference, valueField,displayField,key, renderItem){
   /* if(!thisReference.state.isOpen){
       renderItem= valueField == thisReference.state.selected?
                   renderItem:
                   <span />;
    }*/
    return renderItem;
},

renderChildWrapper = (thisReference, valueField,displayField,element, key, ds) => {
  
  let /*clickVar=(!thisReference.state.propLenses.selectedItem ||
                     !thisReference.state.propLenses.selectedKey )?"":
                        click.bind(null, thisReference, value,key),*/
      optionClass = classNames({
        ["Dropdown-option"]: true
      }),

      renderItem=(<div value={valueField}
                       className={optionClass}
                       onClick={click.bind(null, thisReference,key, valueField,displayField,ds)}>
                            {element}
                  </div>);
  

  return renderItems(thisReference, valueField,displayField,key,renderItem);

},

renderChildItem = (thisReference, valueField,displayField, key, ds) => {
   /* let {children, valueField = null, filter = null} = thisReference.props, 
        [asset] = children,
        {type} = asset;

    asset = _.merge({}, asset, { props: {valueField, filter} });

    let Child = extendedAssetComponent(createListItemWrapper(type)),
    renderItem= <Child asset={asset} ref={key}/>;*/
    return  <div>{displayField}</div>;
},

getInitialState=(thisReference)=>{
    return{
        "isOpen": false,
        "selected":thisReference.props.defaultValue||"select"
    }
},
getComponentProps = (thisReference) => {
    return {
        "selectedItem": null,
        "selectedKey": null,
        "readOnly": false,
        "label": "",
        "defaultValue": "",
        "visible": true,
        "items": []
    }        
},

restItems ={
    "getInitialState":getInitialState
   // implicitActionsToCreate
};
export default repeatableViewGenerater(
                                        "DropdownControl", 
                                        renderDropdown, 
                                        renderChildItem, 
                                        null, 
                                        getComponentProps, 
                                        renderChildWrapper,
                                        restItems
                                        );





//export default ActionBoundControl(repeatableViewGenerater("DropdownControl", renderDropdown, renderChildItem, null, getComponentProps, renderChildWrapper,restItems));

/**<div style={thisReference.props.style}>
        <FormGroup controlId="formControlsSelect" style={display}>
            <ControlLabel>{label}</ControlLabel>
            <FormControl componentClass="select"
                disabled={readOnly}
                ref="formcontrol"
                //onChange={onChange.bind(thisReference) }
                // onClick={thisReference.implicitActions.onClick.bind(thisReference) }
                //onFocus={thisReference.implicitActions.onFocus.bind(thisReference) }
                //onBlur={thisReference.implicitActions.onBlur.bind(thisReference) }
                > {dropDownOptions}
            </FormControl>

 <Dropdown options={dropDownOptions} />
 */






