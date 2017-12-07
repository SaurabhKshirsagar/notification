import React from 'react';
import Reflux from 'reflux';
//Vendor Components
import { Button, ButtonToolbar, Modal, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';
//Store
import DailogFormStore from '../../stores/EntityDesigner/dailogForm';
//Actions
import actions from '../../actions/EntityDesigner/dailogFrom';
import entityStoreAction from '../../actions/EntityDesigner/action';
//Componets
import ModalDlg from './modalDailog';
import appState from '../../helpers/RuntimeAppContext/index.js';

import FormAction from '../../actions/FormActions/FormAction';

let GridAction = React.createClass({
    mixins: [Reflux.connect(DailogFormStore, 'dlgFields')],
    getInitialState: function () {
        return {
            dlgFields: []
        };
    },
    openForm: function () {
        //actions.createEntityForm(this.props.entities, this.props.Name);
        appState.mount(["context"],this);
        if (this.props.Name === "EntityGridActions") {
            FormAction.ShowForm("EntityFormSchema", "Entity", 0, this.createEntity);
        }
        else {
            //actions.createEntityForm(this.props.entities, this);
           FormAction.ShowForm("EntityFieldSchema", "EntityField", 0, this.createField);
        }
    },
    editForm: function () {
      //actions.updateEntityForm(this.props.selected, this.props.Name);
        appState.mount(["context"], this);
        if (this.props.Name === "EntityGridActions") {
            FormAction.ShowForm("EditEntityFormSchema", "Entity", 0, this.createEntity);
        }
        else {
            //actions.createEntityForm(this.props.entities, this);
            FormAction.ShowForm("EditEntityFieldSchema", "EntityField", 0, this.createField);
        }
    },
    deleteForm: function () {
        if (this.props.Name === "EntityGridActions")
            entityStoreAction.deleteEntitySchema(this.props.selected, this);
        else entityStoreAction.deleteEntityFieldSchema(this.props.selected, this);
    },
    closeForm: function () {
        let {dlgFields} = this.state;
        dlgFields[this.props.Name] = false;
        this.setState({ dlgFields });
    },
    createEntity:function(data){
        entityStoreAction.createEntitySchema(data, this);
        FormAction.CloseForm();
    },
    createField:function(data){
        entityStoreAction.createFieldSchema(data, this);
        FormAction.CloseForm();
    },
    edit:function(data){
        if (this.props.Name === "EntityGridActions") {
            entityStoreAction.updateEntitySchema(data, this);
        } else if (this.props.Name === "FieldGridActions") {
            entityStoreAction.updateEntityFieldSchema(data, this);
        }
    },
   save: function (state, data) {
        switch (this.state.dlgFields.Action) {
            case 'create':
                if (this.props.Name === "EntityGridActions") {
                    entityStoreAction.createEntitySchema(data, this);
                } else if (this.props.Name === "FieldGridActions") {
                    entityStoreAction.createFieldSchema(data, this);
                }
                break;
            case 'edit':
                if (this.props.Name === "EntityGridActions") {
                    entityStoreAction.updateEntitySchema(data, this);
                } else if (this.props.Name === "FieldGridActions") {
                    entityStoreAction.updateEntityFieldSchema(data, this);
                }
                break;
        }
        this.closeForm();
    },
    render: function () {
        return (
            <div className="grid-actions">
                <Button onClick={this.openForm}>New</Button>
                <Button onClick={this.editForm}>Edit</Button>
                <Button onClick={this.deleteForm}>Delete</Button>
                 <ModalDlg
                    entityFields={this.state.dlgFields.fields}
                    showModal={this.state.dlgFields[this.props.Name]}
                    onSave={this.save}
                    onClose={this.closeForm}
                    parentSelected={this.props.parentSelected}
                    selected={this.props.selected}
                    entity={this.state.entity}
                    >
                </ModalDlg>
            </div>
        );
    }
});
export default GridAction