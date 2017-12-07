import React,{Component} from 'react';
import { Button, FormGroup, ControlLabel, FormControl, Label} from 'react-bootstrap';
import _ from 'lodash';

class View extends Component{

                getChildren(childrenValues){
                        if(childrenValues){
                            return _.map(childrenValues,(item,key,items)=>{
                                return <span>{`   ${key}: ${item}`}</span>
                            })
                        }return <div />
                }
                render(){
              
                    return <div>{this.getChildren(this.props.children)}</div>         
                }
}
View.defaultProps = {
                "value" : ""             
}
export default View;
