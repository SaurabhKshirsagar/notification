import React,{Component} from 'react';
import {observer} from 'mobx-react';
import {autorun} from 'mobx';
import R from 'ramda';
import { Button, FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap';
import styles from 'components/MyVacation/styles'
function ContextProvider(Wrapped, valueResolver){
                return  observer(class ContextProvider extends Component{
                                constructor(){
                                    super();
                                    this.state={}                             
                                    this.constructor.displayName = `ContextProvider_${Wrapped.name}`;
                                    this.onSubmit=this.onSubmit.bind(this);
                                    this.observerFn.bind(this);
                                }
                                componentDidMount(){
                                  this.disposer = autorun(()=>{this.observerFn()})
                                }
                                componentWillUnmount(){
                                  this.disposer();
                                }
                                observerFn(){
                                    
                                    let {context, mapContextToProps, params} = this.props,
                                    mappedProps = mapContextToProps?mapContextToProps(context,params):{},
                                    mergedProps = _.assign({}, Wrapped.defaultProps, mappedProps),
                                    wrappedComponentProps = {"props" : mergedProps, "contextAvailable" : true};
                                
                                    this.setState(wrappedComponentProps);
                                }

                                onContextPropChange(prop,changePayload){
                                    debugger;
                                     let value= valueResolver(changePayload);
                                     let {onContextPropChange,context,params}=this.props;
                                    
                                     onContextPropChange(context,params,prop,value);
                                }

                                 onSubmit(prop,value){
                                  
                                     let {onSubmit,context,params}=this.props;
                                     onSubmit(context,params,prop,value);
                                }


                                render(){
                                    if (!this.state.contextAvailable){
                                        return null;
                                    }
                                    return (<Wrapped  style={styles.screen} {...this.state.props} 
                                                onContextPropChange={this.onContextPropChange.bind(this)}
                                                onSubmit={this.onSubmit}
                                                >
                                                {this.props.children}</Wrapped>);
                                }
                });
}
module.exports= ContextProvider;