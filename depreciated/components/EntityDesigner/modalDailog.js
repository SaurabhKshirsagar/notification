import React from 'react';
import Reflux from 'reflux';
//Vendor Components
import { Button, ButtonToolbar, Modal, Popover, Tooltip, OverlayTrigger,FormGroup,ControlLabel,FormControl } from 'react-bootstrap';
//Actions
import actions from '../../actions/EntityDesigner/action'

let ModalDlg = React.createClass({
    showDlg: '',
    getInitialState: function () {
        return {
          
        }
    },
    onChangeControl: function (e) {
        let field = e.target.dataset['field'];
        let fVal = e.target.value;
        this.setState({ [field]: fVal, showModal: true });
    },
    render: function () {
        let dailogBody = '';
        if (this.props.entityFields) {
            let entity = this.props
            dailogBody = this.props.entityFields.map((key, value) => {
                let controlId = `formControlsText${value}`;
                let isDisbled = key.field == "Version"?"true":''
                return (
                    <FormGroup 
                        controlId={controlId}>
                        <ControlLabel>
                            {key.field}
                        </ControlLabel>
                        <FormControl
                            type="text"
                            placeholder={key.field}
                            data-field={key.field}
                            defaultValue={key.value}
                            ref={key.field}
                            onChange={this.onChangeControl} key={key.field} 
                            disabled={isDisbled}/>
                    </FormGroup>
                );
            });
        }
        return (
            <Modal
                show={this.props.showModal}
                onHide={this.props.onClose} >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Create
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {dailogBody}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={this.props.onSave.bind(null,this, this.state) } key="modalSave">
                        Save
                    </Button>
                    <Button
                        onClick={this.props.onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
});
export default ModalDlg;