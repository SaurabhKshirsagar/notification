import React from 'react';
import Reflux from 'reflux';
//Vendor Components
import { Button, ButtonToolbar, Modal, Popover, Tooltip, OverlayTrigger } from 'react-bootstrap';
//Store
import DailogFormStore from '../../stores/EntityDesigner/dailogForm';
//Actions
import actions from '../../actions/EntityDesigner/dailogFrom';
import entityStoreAction from '../../actions/EntityDesigner/action';
//Components
import ModalDlg from './modalDailog'

let FieldAction = React.createClass({
    mixins: [Reflux.connect(DailogFormStore, 'dlgFields')],
    getInitialState: function () {
        return {
            showModal: false,
            dlgFields: []
        };
    },
    openForm: function () {
        actions.createEntityForm(this.props.entities);
    },
    editForm: function () {
        actions.updateEntityForm(this.props.selected);
    },
    deleteForm: function () {
        actions.deleteEntityForm(this.props.selected)
    },
    closeForm: function () {
        let obj = [];
        obj['dlgFields'] = this.state.dlgFields;
        obj['dlgFields']['showModal'] = false;
        this.setState(obj);
    },
    save: function (state, e) {
        entityStoreAction.updateEntity(state, this.props.selected);
    },
    render: function () {
        return (
            <div className="grid-actions">
                <Button
                    onClick={this.openForm} >
                    New
                </Button>
                <Button
                    onClick={this.editForm} >
                    Edit
                </Button>
                <Button
                    onClick={this.deleteForm} >
                    Delete
                </Button>
                <ModalDlg><FormRenderer
                    entityFields={this.state.dlgFields.fields}
                    showModal={this.state.dlgFields.showModal}
                    onSave={this.save}
                    onClose={this.closeForm}
                    selected={this.props.selected}
                    entity={this.state.entity}
                    />
                </ModalDlg>
            </div>
        );
    }
});
export default FieldAction