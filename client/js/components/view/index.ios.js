import React, { Component } from 'react';
import AssetComponent from 'components/assetcomponent';
import ErrorHandler from 'components/errorhandler'
import MyErrorHandler from 'components/myerrorhandler'
import {AppRegistry, View, Text} from 'react-native';
class ViewNative extends Component {
	getComponentLenses() {
		return [];
	}
	render() {
		return (
			<View style={this.props.style}>{this.props.children}</View>);
	}
}

export default ViewNative;
