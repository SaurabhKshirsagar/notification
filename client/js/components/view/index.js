import React, { Component } from 'react';
import AssetComponent from 'components/assetcomponent';
import ErrorHandler from 'components/errorhandler'
import MyErrorHandler from 'components/myerrorhandler'

class View extends Component {
	getComponentLenses() {
		return [];
	}
	render() {
		let {id} = this.props;
		return (
			<div style={this.props.style} onClick={this.props.onClick}>
				{this.props.children}
			</div>
		);
	}
}

export default ErrorHandler(React, MyErrorHandler)(View);
