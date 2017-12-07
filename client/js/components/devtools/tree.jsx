import React from "react";
import _ from "lodash";
import R from "ramda";
import { OverlayTrigger, Tooltip, Popover } from "react-bootstrap";
import iconType from "./iconType.js";
import ExpandTree from "./expandTree.jsx";
import { CoreTypes, inferredTypeIdentifier } from "helpers/BuilderApi"

const colon = ":",
    doubleQuets = `"`,
    premitiveCore = _.keyBy([
        [CoreTypes.string],
        [CoreTypes.number],
        [CoreTypes.date],
        [CoreTypes[`${inferredTypeIdentifier}string`]],
        [CoreTypes[`${inferredTypeIdentifier}boolean`]],
        [CoreTypes[`${inferredTypeIdentifier}number`]]
    ]),
    nullChar = null,
    getNullTypeCharater = {
        [premitiveCore]: nullChar,
    }
export default class Tree extends React.Component {
    constructor(props) {
        super(props);
        this.generateChild = this.generateChild.bind(this);
        this.state = {
            expand: false,
            expandable: props.node
        }
    }
    expandTree(node, value, context) {

        context.setState({
            expand: !context.state.expand,
            expandable: value

        });
    }
    componentWillReceiveProps(props) {
    }
    checkNodeError(node) {
        return _.isObject(node) ? node.get("error") != null ? true : false : false;
    }

    getParentNodeValue(propsNodes) {
        return propsNodes ?
            propsNodes.get("value") ?
                propsNodes.get("value") :
                propsNodes :
            propsNodes;
    }
    getIconBasedOnType(type) {
        let iconTypeFn = iconType[type];
        if (iconTypeFn) {
            return iconTypeFn(type);
        } else {
            //return default icon 
            return iconType["default"](type);
        }
    }
    isExpand(node) {
        let type = node.getIn(["schema", "type"]),
        nodeValue = node ? node.get("value"):undefined;
        return !premitiveCore.hasOwnProperty(type) && !_.isString(nodeValue);
    }
    getIgnoreValue(node) {
        let type = node.getIn(["schema", "type"]) || complex,
            nodeValue = node.get("value");
        return _.isNil(nodeValue);
    }
    generateChild(propsNodes) {
        let childNodes,
            nodes = this.getParentNodeValue(propsNodes);
        if (nodes != null) {
            if (typeof (nodes) == "string") {
            } else {
                childNodes = nodes.map((node, value) => {

                    let errorValue, errorIcon,
                        hasError = this.checkNodeError(node);
                    if (hasError) {
                        errorValue = hasError ? node.get("error") : "";
                        let tooltip = <Tooltip id="tooltip">{errorValue.get("message")}</Tooltip>;
                        errorIcon = <OverlayTrigger placement="top" overlay={tooltip}>
                            <span className='tree-error'>e</span>
                        </OverlayTrigger>
                    }
                    let nodeValue = node.get ? node.get("value") : node,
                        schema = node.get("schema") ? node.get("schema") : null,
                        type = _.isObject(node) ?
                            schema.size ?
                                schema.get("type") :
                                "object" :
                            "string";
                    let isExpandIcon = this.isExpand(node) /*type !== "@string"*/ && _.isObject(node)/* && !hasError*/ && nodeValue !== null ?
                        (this.state.expand ?
                            "fa fa-caret-down tree-icon" :
                            "tree-icon fa fa-caret-right") : '';

                    let typeIcon = this.getIconBasedOnType(type);

                    let nullValue = _.isNil(nodeValue) ?
                        <span className='tree-null-char'>{`null`}</span> :
                        null;
                    let literal = !_.isNil(nodeValue) ? _.isString(nodeValue) ? <span>{doubleQuets}</span> :null : null;
                    let expandTree = this.isExpand(node) && _.isObject(node) && !_.isString(nodeValue) && nodeValue !== null ?

                        <ExpandTree node={node} name={value} expand={this.state.expand} expandable={this.state.expandable} /> :

                        <div className='tree-string-var'>
                            <span>{colon}</span>
                            {literal}
                            <span className='tree-text-val'>{nodeValue !== null ? nodeValue.toString() : nodeValue}</span>
                            {literal}{nullValue}
                        </div>

                    return (
                        <li key={value} className='tree-node'>
                            <i className={isExpandIcon}></i>
                            {errorIcon}
                            {typeIcon}
                            <span className='tree-label' onClick={this.expandTree.bind(null, node, value, this)}>{value}</span>
                            {expandTree}
                        </li>)
                });
            }
        }
        return childNodes;
    }
    render() {
        return (<ul>
            {this.generateChild(this.props.node)}
        </ul>);
    }
}
