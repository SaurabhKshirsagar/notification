import React, {PureComponent} from "react";
import copy from 'copy-to-clipboard'
import {Seq} from "immutable";
import _ from "lodash";
import R from "ramda";
import { CoreTypes, ErrorTypes, inferredTypeIdentifier } from "helpers/BuilderApi";
import {getTypeHandler} from "helpers/createHandler";

const
Styles = {
    "BaseField" : {
        marginLeft: 5,
        marginRight : 10,
        listStyle : "none"
    },
    "ExpandedIndicator" : {
        color:"#00f",
        width:10,
        display:"inline-block",
        fontWeight: 600
    },
    "ErrorIndicator" : {
        marginRight : 7,
        color : "#d00"
    },
    "TypeIndicator" : {
        marginRight : 5,
        color : "#888"
    },
    "SingleField" : {
        cursor : "pointer",
        marginLeft : 10
    },
    "MultiValueFieldHeader" : {
        cursor : "pointer",
        display : "inline-block"
    },
    "EmptyValue" : {
        marginLeft : 22,
        color : "#888"
    },
    "ValueSeparator" : {
        marginLeft : 2,
        marginRight : 5,
        fontWeight: 600
    },
    "SingleValue" : {
        fontWeight: 400
    },
    "FieldLabel" : {
        fontWeight: 600
    },
    "NoMatchesFound" : {
        display : "inline-block",
        marginLeft : 10,
        marginTop: 10,
        color : "#888"
    },
    "copyButton" : {
        marginLeft : 10
    },
    "italicFont" : {
        fontStyle : "italic" 
    },
    "red" : {
        color : "red"
    },
    "green" : {
        color : "green"
    },
    "blue" : {
        color : "blue"
    },
    "brown" : {
        color : "brown"
    },
    "black" : {
        color : "black"
    }
},
swigy = '{}',
bracket = '[]',
str = 'str',
bool = 'bool',
view = 'v',
date = 'date',
dict = 'dict',
TypeUnknown = "unknown",
PageSize = "100",
ValueSeparator = () => <span style={Styles.ValueSeparator}>:</span>,
getTypeIndicator = (schema, field, coreType) => {
    let typeIcon = getTypeIcon(schema, field, coreType);
    return (
        <span style={Styles.TypeIndicator}>{typeIcon}</span>
    );
},
getTypeIcon = (schema, field, coreType) =>{
    let typeIcon = "";
    if(field.get("uiContext")){
        typeIcon = view;
        return (<span style={Styles.red}>{typeIcon}</span>);
    }
    let style = {},
    toolTipText = "",
    isInferedType = (coreType.charAt(0) == "@"),
    baseType =  isInferedType ? coreType.substr(1) : coreType;
    switch(baseType){
        case 'complex' : 
            typeIcon = swigy;
            toolTipText = schema.get("name");
            break;
        case 'list'    :
            typeIcon = bracket;
            toolTipText = schema.get("of");
            break;
        case 'string'  : 
            typeIcon = str;
            _.merge(style,Styles.blue)
            if(!isInferedType) 
                toolTipText = schema.get("name");
            break;
        case 'boolean' :
            typeIcon = bool;
            if(!isInferedType) 
                toolTipText = schema.get("name");
            break;
        case 'number'	:
            typeIcon = getNumberIcon();
            if(!isInferedType) 
                toolTipText = schema.get("name");
            break;
        case 'date'     :
            typeIcon = date;
            _.merge(style,Styles.black)
            if(!isInferedType) 
                toolTipText = schema.get("name");
            break;
        case 'dictionary'   :
            typeIcon = dict;
            toolTipText = schema.get("name");
            break;
        default	        :
            typeIcon = '?';
            _.merge(style,Styles.red)
            break;            
    };
    if(isInferedType){
        _.merge(style,Styles.italicFont)
    }
    return (<span style={style} title={toolTipText}>{typeIcon}</span>);
},
getNumberIcon=()=> { 
    return (
        <span>
            <span style={Styles.red}>1</span><span style={Styles.green}>2</span><span style={Styles.blue}>3</span>
        </span>
    );
},
getExpandedStateIndicator = (expanded) => {
    return (
        <span style={Styles.ExpandedIndicator}>{expanded ? "-" : "+"}</span>
    );
},

getFieldLabelComponent = (name, field, value, isSingleValue) => {
    let uiContext = field.get("uiContext"),
    copyToClipboardmessage = "Click here to copy this value to clipboard.",
    style = {};
    if(uiContext){
        //name = uiContext.substr(6);
        name = uiContext;
        _.merge(style,Styles.brown);    
    }
    _.merge(style,Styles.FieldLabel);
    return (
        <span style={style} onClick={copyToClipboard.bind(null,value)} title={copyToClipboardmessage}>{name}</span>
    );
},
getErrorIndicator = (error, schema) => {
    if (!error){
        return null;
    }
    let type = schema.get("type"),
    handler = getTypeHandler(type),
    format = handler.defaultSchemaJson.format,
    errorMessage = error.toJSON().toString(handler,format);

    return (
        <em title={errorMessage} style={Styles.ErrorIndicator}>err</em>
    );
},
getValueComponentForSingleValueField = (type, value) => {
    return (
        <span style={Styles.SingleValue} title={String(value)}>{(String(value).length > 140) 	?	(`${String(value).substring(0,140)}...`)	: 	((String(value) == '')  ? "' '" : String(value))}</span>
    );
},
getNoMatchesFoundComponent = (searchText) => (
    <em style={Styles.NoMatchesFound}>{`No matches found for "${searchText}".`}</em>
),
renderSingleValueField = (name, field, type, coreType, component) =>{
    let  
    error = field.get("error"),
    schema = field.get("schema"),
    value = field.get("value"),
    typeIndicator = getTypeIndicator(schema, field, coreType),
    fieldLabelComponent = getFieldLabelComponent(name, field, value, true),
    errorComponent = getErrorIndicator(error, schema),
    valueComponent = getValueComponentForSingleValueField(type, value),
    fieldComponent = (
        <span style={Styles.SingleField}>
            {typeIndicator}{errorComponent}{fieldLabelComponent}<ValueSeparator />{valueComponent}
        </span>
    );

    return fieldComponent;
},
getPaginationComponent = (start, pageSize) => {
    return <span><i>...load next {pageSize} items...</i></span>;
},
getChildrenComponentsForMultiValueField = (parentValue, start = 0) =>{
    if (parentValue == null){
        parentValue = Seq();
    }
    let childrenFieldEntries = parentValue.entrySeq().skip(start),
    childrenCount = childrenFieldEntries.count(),
    pageSize = Math.min(childrenCount, PageSize),
    more = (childrenCount > PageSize);
    if (childrenCount == 0){
        return [<em key={0} style={Styles.EmptyValue}>empty</em>];
    }

    let childrenComponents = childrenFieldEntries.map(entry => {
        let [name, field] = entry;
        return <FieldNode key={name} {...{name, field}} showSelf="true" />;
    }).toArray();

    if (more){
        let next = start + pageSize,
        remaining = Math.min(childrenCount - next, PageSize);
        childrenComponents.push(getPaginationComponent(next, remaining));
    }

    return childrenComponents;
},
copyToClipboard = (value) =>{copy(String(value))},
toggleExpanded = (field, component) => {
    let stateCache = NodeCache.get(field),
    {expanded: stateExpanded} = component.state,
    {expanded} = stateExpanded ? {"expanded" : stateExpanded} : (stateCache? stateCache : {"expanded" : false});
    expanded = !expanded;
    NodeCache.set(field, {expanded});
    component.setState({expanded});
},
renderMultiValueField = (name, field, type, coreType, component) =>{
    let error = field.get("error"),
    schema = field.get("schema"),
    value = field.get("value"),
    {expanded} = component.state,
    {showSelf} =  component.props,
    expandedStateIndicator = showSelf ? getExpandedStateIndicator(expanded) : null,
    typeIndicator = showSelf ? getTypeIndicator(schema, field, coreType) : null,
    fieldLabelComponent = showSelf ? getFieldLabelComponent(name, field, value, false) : null,
    errorComponent = showSelf ? getErrorIndicator(error, schema) : null,
    fieldComponent = showSelf ? (
        <li key={0} onClick={toggleExpanded.bind(null, field, component)} style={Styles.MultiValueFieldHeader}>
            {expandedStateIndicator}{typeIndicator}{errorComponent}{fieldLabelComponent}
        </li>
    ) : null,
    children = expanded ? getChildrenComponentsForMultiValueField(value, 0) : [];
    
    return (
        <ul style={Styles.BaseField}>
            {fieldComponent}
            {children.map((child, index)=><li key={index + 1}>{child}</li>)}
        </ul>
    );
},
guessType = (value)=>{
    if (_.isNil(value)){
        return TypeUnknown;
    }
    if (_.isString(value)){
        return CoreTypes[`${inferredTypeIdentifier}string`];
    }
    if (_.isNumber(value)){
        return CoreTypes[`${inferredTypeIdentifier}number`];
    }
    if (_.isBoolean(value)){
        return CoreTypes[`${inferredTypeIdentifier}boolean`];
    }
    if (_.isArrayLike(value)){
        return CoreTypes[`${inferredTypeIdentifier}list`];
    }
    if (_.isObjectLike(value)){
        return CoreTypes[`${inferredTypeIdentifier}complex`];
    }
    
    return TypeUnknown;
},
getFieldType = (field) => {
    let error = field.get("error"),
    schema = field.get("schema"),
    value = field.get("value"),
    errorType = error ? error.get("type") : null;
    
    // if there is no type error in this field, return its type.
    if (schema && (!errorType || (errorType != ErrorTypes.typeMismatch))){
        return schema.get("type");
    }

    return guessType(value);
},
getCoreType = (field) => {
    let schema = field.get("schema"),
    schemaType = schema.get("type"),
    handler = getTypeHandler(schemaType);
    return handler.coreType;
},
fieldRenderer = (name, field, component) => {
    if (!field){
        let {searchText} = component.context;        
        if (searchText){
            return getNoMatchesFoundComponent(searchText);
        }
        return null;
    }
    let type = getFieldType(field),
    coreType = (type == TypeUnknown) ? type : getCoreType(field);
    switch (coreType) {
        case TypeUnknown:
        case CoreTypes.string : 
        case CoreTypes.number :
        case CoreTypes.date : 
        case CoreTypes.date : 
        case CoreTypes[`${inferredTypeIdentifier}string`] : 
        case CoreTypes[`${inferredTypeIdentifier}boolean`] : 
        case CoreTypes[`${inferredTypeIdentifier}number`] : {
            return renderSingleValueField(name, field, type, coreType, component);
        }
        case CoreTypes.list : 
        case CoreTypes.complex :
        case CoreTypes.dictionary :
        case CoreTypes[`${inferredTypeIdentifier}list`] : 
        case CoreTypes[`${inferredTypeIdentifier}complex`] : {
            return renderMultiValueField(name, field, type, coreType, component);
        }
    }

    return null;
};

let NodeCache = new WeakMap();

class FieldNode extends PureComponent {
    constructor(props, context){
        super(props);
        let {field, expanded} = props,
        {searchText} = context;
        expanded = !!searchText || !!expanded;
        if (field && !NodeCache.has(field)){
            NodeCache.set(field, {expanded});
        }
        else {
            expanded = field ? NodeCache.get(field).expanded : false; 
        }

        this.state = {expanded};
    }

    render(){
        let {name, field} = this.props;
        return fieldRenderer(name, field, this);
    }
};

FieldNode.contextTypes = {
    "searchText" : React.PropTypes.string
}

export default FieldNode;