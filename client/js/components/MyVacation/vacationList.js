import React from 'react';
import ContextProvider from '../testnxobserve/contextprovider.js';
import ContextComponent from "components/contextcomponent"
import _ from 'lodash';
import LinkToWrapper from "components/stroage/linktowrapper";
import {Button} from 'react-bootstrap';
import PathComponent from 'components/MyVacation/pathComponent.js'
import NewVacation from 'components/MyVacation/NewVacation.js'
import {Match} from 'react-router';


class VacationsList extends ContextComponent {
    getParams(){
          let {params:{MyVacations}} = this.props;
         return {MyVacations};
	}
    render() {
   
            return (<div style={{height: "92vh", width:"85%",margin:'5px',display:"flex"}}>
                    <div style={{overflow:'auto',backgroundColor:'#f5f5f5', height: "92vh", width:"30%",margin:'5px',padding:'3px'}}>
                        <LinkToWrapper to= {`${this.props.pathname}/NewVacation`} >
                                    <Button className="btn btn-primary"  style={{width:"100%"}} >New Vacations Request</Button>
                        </LinkToWrapper>
                        {this.props.params.MyVacations.map((vacation, key) => {
                            return <div className='list-group-item' key={key} style={{ width: "100%", borderBottom: "2px solid" }}>
                                <h4 class="list-group-item-heading">{`ID`}</h4>
                                    <div style={{width:'100%'}}>
                                        <h5 >Start Date</h5>
                                        <div className='list-group-item-text'>
                                            {`${vacation.startDate}`}
                                        </div>
                                    </div>
                                    <div style={{width:'100%'}}>
                                        <h5 >End Date</h5>
                                        <div className='list-group-item-text'>
                                            {`${vacation.enddate}`}
                                        </div>
                                    </div>
                                    <h5 >Reason</h5>
                                    <div className='list-group-item-text'>
                                        {`${vacation.reason}`}
                                    </div>
                                <div>
                            </div>
                            </div>

                        }) }
            </div>
            
              <PathComponent pathname={`${this.props.pathname}/NewVacation`} component={NewVacation} {...this.getContexts()} />
            </div>);
       
    }
}

export default ContextProvider(VacationsList)