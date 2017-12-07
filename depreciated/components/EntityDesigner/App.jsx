import React from 'react';
import Reflux from 'reflux';
import {observer} from 'mobx-react';
//Vendor Components
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import { Grid, Row, Col, Badge, Label } from 'react-bootstrap';


//Styles
import Styles from '../../helpers/styles.js';

//Actions
import EntityStore from '../../stores/EntityDesigner/EntityStore.js';
import actions from '../../actions/EntityDesigner/action.js';
//Components
import GridAction from './GridAction';
import FieldAction from './FieldAction';
import GridLay from './GridLay';
import FieldsLay from './FieldsLay';
//wrapers
import AppContext from '../../helpers/RuntimeAppContext';

import FormRenderer from '../FormRenderer/FormRenderer';
import ModalDailogBox from '../FormRenderer/ModalDailogBox';

let App = observer(React.createClass({
    mixins: [Reflux.connect(EntityStore, 'entity')],
    getInitialState: function () {
        return {
            entity: [],
            selectedRow: [],
            selectedFieldRow:[]
        }
    },
    componentWillMount:function(){
        actions.fetchEntitySchema();
    },    
    rowSelect: function (e, isSelected) {
        AppContext.mount(["UpdateEntity"],isSelected ? e : [] );
        this.setState({ selectedRow: isSelected ? e : [] });
    },
    fieldSelect:function(e,isSelected){
       // AppContext.mount(["selectedFieldRow"],isSelected ? e : []);
        AppContext.mount(["UpdateEntityField"],isSelected ? e : [] );
        this.setState({ selectedFieldRow: isSelected ? e : [] });
    },
    toggel: function (e) {
    },
    objectToArray:function(obj){
        return Object.keys(obj).map(function (key) {return obj[key]});
    },
    render: function () {
        let toggel = this.toggel;
         let selectRowProp = {
                        mode: "radio",
                        clickToSelect: true,
                        className: 'selected',
                        onSelect: this.rowSelect
                };
        let selectFieldRowProp = {
                        mode: "radio",
                        clickToSelect: true,
                        className: 'selected',
                        onSelect: this.fieldSelect
                };
                let options = {
                        paginationSize: 5,
                        paginationShowsTotal: false,
                        sizePerPage: 20
                };
        return (
            <Grid>
                <ModalDailogBox>
                        <FormRenderer/>
                </ModalDailogBox>
                <Row className="show-grid">
                    <Col xs={12} md={9}>
                        <h3><Label>Entity Information</Label></h3>
                        <div className="grid-container">
                            <div>
                                <GridAction
                                    entities={this.state.entity}
                                    selected={this.state.selectedRow}
                                    Name="EntityGridActions"
                                    >
                                </GridAction>
                            </div>
                            <div>
                                <BootstrapTable
                                    data={this.objectToArray(this.state.entity)}
                                    pagination={true}
                                    search={true}
                                    selectRow={selectRowProp}
                                    options={options}>
                                    <TableHeaderColumn key="name" dataField="Name" isKey={true}>Name</TableHeaderColumn>                               
                                    <TableHeaderColumn key="Title" dataField="Title" >Title</TableHeaderColumn>
                                    <TableHeaderColumn key="Description" dataField="Description">Description</TableHeaderColumn>
                                    <TableHeaderColumn key="UniqueKey" dataField="UniqueKey">Unique Key</TableHeaderColumn>
                                    <TableHeaderColumn key="Version" dataField="Version">Version</TableHeaderColumn>
                                </BootstrapTable>
                                <h3><Label>Fields Information</Label></h3>
                                <div>
                                </div>
                                  <GridAction
                                    entities={this.state.entity}
                                    selected={this.state.selectedFieldRow}
                                    parentSelected={this.state.selectedRow}
                                    Name="FieldGridActions"
                                    >
                                </GridAction>
                                <BootstrapTable
                                    data={this.state.selectedRow.Attributes?this.objectToArray(this.state.selectedRow.Attributes):[]}
                                    pagination={true}
                                    search={true}
                                    selectRow={selectFieldRowProp}
                                    options={options}>
                                    <TableHeaderColumn dataField="Name" isKey={true}>Name</TableHeaderColumn>                                   
                                    <TableHeaderColumn dataField="Title">Title</TableHeaderColumn>
                                    <TableHeaderColumn dataField="Type">Type</TableHeaderColumn>                                    
                                    <TableHeaderColumn dataField="Description">Description</TableHeaderColumn>
                            </BootstrapTable>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );

    } 
 }));


export default App;