import React from "react";
import {Button, Modal, Overlay, Glyphicon, FormControl} from "react-bootstrap";
import JSONTree from 'react-json-tree';
import Draggable from 'react-draggable';
import Immutable, {Iterable} from "immutable";
import _ from "lodash";
import R from "ramda";
import styles from "styles/custome.css";
import {Store, Prop, getLens, get, set, notify} from "appcontext";
import iconType from "./iconType.js";
import FieldNode from "./proptree.jsx";


let TooltipStyle = {
    top: 50,
    left: 50,
    position: 'absolute',
    padding: '0 5px'

},
TooltipInnerStyle = {
    padding: '3px 8px',
    color: '#fff',
    textAlign: 'center',
    borderRadius: 3,
    backgroundColor: '#000',
    opacity: .75
},
TooltipArrowStyle = {
    position: 'absolute',
    width: 0, height: 0,
    borderRightColor: 'transparent',
    borderLeftColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderStyle: 'solid',
    opacity: .75
},
higherZindex = {
    zIndex:1111
},
PlacementStyles = {
    bottom: {
        tooltip: { marginBottom: 10, padding: '5px 0' },
        arrow: { top: 0, marginLeft: -5, borderWidth: '0 5px 5px', borderBottomColor: '#000' }
    }
},

ToolTip = props => {

    let {
        style,
        arrowOffsetTop: top = placementStyle.arrow.top,
        children
    } = props;

    return (
        <div style={{...TooltipStyle, ...style }}>
            <div style={{...TooltipArrowStyle, top }}/>
            <div style={TooltipInnerStyle}>
                {children}
            </div>
        </div>
    );
},
theme = {
    scheme: 'Material Theme',
    author: 'wimer hazenberg (http://www.monokai.nl)',
    base00: '#FFFFFF',
    base01: '#FFFFFF',
    base02: '#FFFFFF',
    base03: '#75715e',
    base04: '#a59f85',
    base05: '#f8f8f2',
    base06: '#f5f4f1',

},
getIconfromType = (type) => {

},
getItemString = (type = "string", data, itemType, itemString) => {
    if (R.isEmpty(data)) {
        return;
    }
    return iconType[type.toLocaleLowerCase()](type);
},
toAppContext = (state, rootState) => rootState.setIn(["value", "ApplicationContext"], state),
fromAppContext = (state) => state.getIn(["value", "ApplicationContext"]);

export default class DevTool extends React.Component {
    constructor(props) {
        super(props);

        this.state = { show: false, data: {}, searchText:"" };
        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.filterTree = this.filterTree.bind(this);
    }
    toggle(e) {
        /*
        // Why is "notify" invoked here? 
        let applicationContextLens = getLens(new Prop("ApplicationContext"));

        notify(applicationContextLens);
        */
        let show = this.state.show;
        if (!show) {
            show = true;
        }
        else {
            show = false;
        }
        return this.setState({ show: show });
    }
    onStatusChange({lens, state}) {
        state = fromAppContext(state);
        this.setState({
            data: state,
            rootState: state
        });
    }
    componentDidMount() {
        this.unsubscribe = Store.listen(this.onStatusChange, this);
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    handleChange(e) {
        let text = e.target.value.trim();
        if (text.length < 3) {
            if (text.length === 0) {
                this.handleCancel();
            }
            return;
        }
        // Cancel existing filtering if ongoing and schedule next one.
        this.setState({ "continue": false, "searchText" : text }, () => this.filterTree(text.toLowerCase()));
    }

    handleCancel() {
        this.setState({ "continue": false, "data": this.state.rootState });
    }
    updateTreeControl(iter, context) {
        let next = iter.next();
        if (context.state.continue && !next.done) {
            let node = next.value;
            //console.info(node.toJSON());
            context.setState({ "data": fromAppContext(toAppContext(node, this.state.rootState)) }, () => {
                return this.updateTreeControl(iter, context)
            });
        }
    }

    getChildContext(){
        return {
            "searchText" : this.state.searchText
        }
    }

    filterTree(searchText) {
        let iter = filter(this.state.rootState, searchText);
        this.setState({ "continue": true }, () => this.updateTreeControl(iter, this));
    }
    render() {
        return (
            <Draggable >
                <div className='overlay-example' style={higherZindex}>
                    <div className='dev-toggle' ref='target' onClick={this.toggle} >
                        <Glyphicon glyph="align-left" />
                    </div>
                    <div   className='dev-overlay' >
                        <Overlay
                            show={this.state.show}
                            onHide={() => this.setState({ show: false }) }
                            container={this}
                            >
                            <div className='dev-jsonTree scrollbar'>
                                <FormControl
                                    type="text"
                                    defaultValue={this.state.value}
                                    placeholder="Search"

                                    onChange={this.handleChange}
                                    />
                                 <FieldNode field={this.state.data} expanded={true} showSelf={false}/>
                            </div>
                        </Overlay>
                    </div>
                </div>
            </Draggable>
        );
    }
};

DevTool.childContextTypes = {
    "searchText" : React.PropTypes.string
};

function* filter(node, searchText) {
    if (!node){
        return null;
    }

    let nodeValue = node.get("value"),
    nodeValueIsIterable = Immutable.Iterable.isIterable(nodeValue),
    children =  nodeValueIsIterable
                    ? nodeValue.entrySeq() 
                    : Immutable.Seq();
    let res = node;
    if (nodeValueIsIterable) {
        res = res.setIn(["value"], res.getIn(["value"]).clear());
    }
    let recursionCandidates = Immutable.fromJS({});
    for (let child of children) {
        let [key, field] = child,
        value = field.get("value");
        if (key.toString().toLowerCase().indexOf(searchText) != -1) {
            res = res.setIn(["value", key], field);
        }
        else if (!Iterable.isIterable(value)) {
            let stringValue = value ? value.toString().toLowerCase() : '';
            if (stringValue.indexOf(searchText) != -1) {
                res = res.setIn(["value", key], field);
            }
            continue;
        }
        if (Iterable.isIterable(value)) {
            recursionCandidates = recursionCandidates.set(key, field);
        }
    }
    yield res;
    for (let recursionCandidate of recursionCandidates.entrySeq()) {
        let [key, value] = recursionCandidate,
            recursionFilter = filter(value, searchText),
            next = recursionFilter.next();
        while (!next.done) {
            let node = next.value,
            nodeValue = node.get("value"),
            size = node && nodeValue ? nodeValue.size : 0; 
            if (size != 0){
                res = res.setIn(["value", key], node);
            }
            next = recursionFilter.next();
            yield res;
        }
    }
}
