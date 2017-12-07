var React = require('React');
var _ = require('lodash');
var Reflux = require('reflux');
var Modal = require('react-bootstrap/lib/Modal');
var FormAction = require('../../actions/FormActions/FormAction');
var FormStore = require('../../stores/FormStore/FormStore');
var {Button, FormGroup, ControlLabel, FormControl}=require('react-bootstrap');

var ModalDailogBox = React.createClass({
    mixins: [Reflux.connect(FormStore, 'formProps')],

    
    render: function () {
    var children=''

       if(Object.keys(this.state)!=0) {
        let {formName,entityList,entityKey,onSaveClick}=this.state.formProps;
  
        children= React.Children.map(this.props.children, function (child) {
            return React.cloneElement(child, {
                formName:formName,
                entityList:entityList,
                entityKey:entityKey,
                onSaveClick:onSaveClick
            });
          })
        return (<div>
            <Modal show={this.state.formProps.showModal} onHide={FormAction.CloseForm}>
                <Modal.Header closeButton>   
                </Modal.Header>
                <Modal.Body>
                    {children}
                </Modal.Body>
            </Modal>
        </div>);
       }else
       return <div/>
    }
})

export default  ModalDailogBox;

