import React, {Component} from 'react';
import {Match} from 'react-router';
import R from 'ramda';
/*
HOC component to take care of the "path" settings of the 
given asset component.
It renders a Match component if a "path" is present in "asset".
*/
function pathComponent(Wrapped) {
		return class PathComponent extends Component{
		loadWrapped(props){
			//delete this.props.asset.props.path;
			//let {path,...others}=this.props;
			return <Wrapped {...props} {...this.props} />;
		}
		render(){
			// get the match details from "asset" props
				let {path,...others} = this.props;
				//{path,...others}=this.props.asset.props;
				return ( 
					path 
					? <Match pattern={path.pattern || "/"} 
						exactly={!!path.exactly} 
						render={this.loadWrapped.bind(this)} />
					: <Wrapped {...this.props} />
				);
	}
}
};

export default pathComponent;