import { Component } from 'react';
import React from 'react';
import _ from "lodash";
import R from 'ramda';
import applicationContextProvider from "engine/app/applicationContextProvider.js";
import { remove } from "appcontext";

function lazyComponent(preconditions, preRenderProcesser, getComponent, processChildren) {
	return class LazyComponent extends Component {
		constructor(props) {
			super(props);
			this.state = _.merge({}, this.state, {
				"fetched": false,
				"Component": null
			});
		}
		updateState({fetched, Component, props}) {
			if(this.unmounting){
				return;
			}
			this.setState({ fetched, Component, props });
		}
		getComponent(props) {
			return getComponent(props)
				.then(Component => ({ fetched: true, Component, props }));
		}
		componentDidMount() {
			//super.componentDidMount();
			// if preconditions fail, set null as component.
			// console.log("Props from Component will mount ");
			// console.dir(this.props);
			if (typeof preconditions == "function"
				&& !preconditions(this.props)) {
				this.updateState({ "fetched": true, "Component": null, props });
				return;
			}
			preRenderProcesser(this.props)
				.then(this.getComponent)
				.then(this.updateState.bind(this));
		}
		componentWillUnmount() {
			//let {id, context} = this.state.asset.props;
			//remove(context);
			this.unmounting = true;
		}

		render() {
			//console.log(this.state);
			if (!this.state.fetched) {
				return this.props.waitingComponent || null;
			}
			let {Component} = this.state;
			if (Component == null) {
				return null;
			}
			//console.debug(`Lazycomponent:render: ${Component.name || Component}`);
			//let newProps =this.state.props;
			//let newProps=this.state.props?this.state.props.asset.props:this.state.props;
			let newProps = processChildren(this.state, this.props);
			// console.log(newProps);
			return <Component ref={(comp)=>this.component = comp} {...newProps} />;
			//return React.createElement(Component,{...newProps});
		}
	}
}

export default lazyComponent;