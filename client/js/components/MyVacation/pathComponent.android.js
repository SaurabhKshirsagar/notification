import React, {Component} from 'react';
import {Match} from 'react-router';
import R from 'ramda';
export default class PathComponent extends Component {
	render() {
		let {pathname, exactly, component,...rest} = this.props;
		let Component = component;
		return (<Match pattern={pathname}
			exactly={exactly}
			render={(props) => <Component mapContextToProps={
				($context, $params) => {
					return {...props,...rest }
				}
			}/>}/>
		);
	}
};