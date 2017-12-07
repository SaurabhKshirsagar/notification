import { Component } from 'react';
import React from 'react';
import _ from "lodash";
import R from 'ramda';
import {extendObservable, observable} from 'mobx';

class ContextComponent extends Component {
		constructor(props){                                                                                                                                                                
			super(props);
			this.setContextVars();
		}

		getComponentProps(){return {}};
		
		getParams (){return null}
		getContexts(){ return{context: this.state.context, params:this.getParams()}}
		getContextVars(){return{}}
		setContextVars(){
			let ob=observable({})
			let context = extendObservable(ob, this.getContextVars());
			this.state = {context};
		}
	}


export default ContextComponent;