import React from 'react';
import ContextProvider from '../testnxobserve/contextprovider.js';
import ContextComponent from "components/contextcomponent"
import _ from 'lodash';
import LinkToWrapper from "components/stroage/linktowrapper";
import {Button} from 'react-bootstrap';
import PathComponent from 'components/MyVacation/pathComponent.js'

import {Match} from 'react-router';


class Holidays extends ContextComponent {
    getParams(){
          let {params:{Holidays}} = this.props;
         return {Holidays};
	}
    render() {
        
            return (<div style={{height: "92vh", width:"85%",margin:'5px',display:"flex"}}>
                    <div style={{overflow:'auto',backgroundColor:'#f5f5f5', height: "92vh", width:"30%",margin:'5px',padding:'3px'}}>
                        {this.props.params.Holidays.map((Holiday, key) => {
                            return <div className='list-group-item' key={key} style={{ width: "100%", borderBottom: "2px solid" }}>
                                <h4 class="list-group-item-heading">{`${Holiday.Title}`}</h4>
                                    <div style={{width:'50%'}}>
                                        <h5 >{`${Holiday.Date}`}</h5>
        
                                    </div>
                                <div>
                            </div>
                            </div>

                        }) }
            </div>
              
            </div>);
      
    }
}

export default ContextProvider(Holidays)