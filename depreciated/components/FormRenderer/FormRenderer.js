import React from 'react';
import Reflux from'Reflux';
import _ from 'lodash';
import {Button, FormGroup, ControlLabel, FormControl, Checkbox} from 'react-bootstrap';
import DateTimeField from'react-bootstrap-datetimepicker';
import Multiselect from'react-bootstrap-multiselect';
import Bootstrap from'bootstrap/dist/css/bootstrap.css';
import EntityBuilder from '../../helpers/EntityBuilder';
import Actions from '../../actions/FormActions/Actions';
import ProcessAction from '../../actions/FormActions/ProcessActions';
import ProcessStore from '../../stores/FormStore/ProcessStore';
import appState from '../../helpers/RuntimeAppContext/index.js';
import DbContext from '../../helpers/PersistenceLayer/index.js';

var FormRenderer = React.createClass({
    getInitialState() {
        return { formSchema: '' };
    },
    componentWillMount() {
        DbContext.get(["Schemas","FormSchema",this.props.formName])
        .then((value)=>{ 
            this.setState({formSchema:value})
            })
        .catch((e)=>{
           this.setState({formSchema:this.state.formSchema})
        });     
    }, 
    createVariableIfNotExist(){
        let variables = this.state.formSchema.variables;
        let variableKeys = Object.keys(variables);
        if (variableKeys.length > 0) {
            variableKeys.forEach(function (variable) {
                let {[variable]: variableType} = variables;
                if (appState.getInstance([variable]) == null) {
                    appState.mount([variable], { "$type": variableType })
                }
            }, this);
        }
    },

    getValues() {
        let result = _.transform(this.refs, (prev, ref) => {
            return prev[ref.getName()] = ref.getValue();
        }, {});
        return result;
    },

    render() {
        let layoutColumnsCount = 0;
        let fromHtml='';
        switch (this.state.formSchema) {
            case "FailToLoadSchema":
               fromHtml=<div><h3>Fail to load form schema </h3></div>
                break;
            case null:
               fromHtml=<div><h3>Loding...</h3></div>
                break;
            case '':
               fromHtml=<div><h3>Loding...</h3></div>
                break;
            default:
                layoutColumnsCount = this.state.formSchema.layoutColumnsCount;
                fromHtml=<div style={{ display: 'inline-block' }}>
                <form>
                    {this.state.formSchema.Elements.map((Element, i) => {
                        return <Control key={i}
                            {...Element}
                            layoutColumnsCount={layoutColumnsCount}
                            ref={`control${i}`} />
                    }) }
                </form>
            </div>
                break;
        }
  
        return <div>
            {fromHtml}
        </div>
    }
})


var Control = React.createClass({
    getInitialState() {
        let nameArray=(this.props.name).split(".");
        let componentvalue=appState.getInstance(nameArray);
        return { value: componentvalue };
    },
    componentWillReceiveProps() {
    },
    getValue() {
        return this.state.value;
    },
    getName() {
        return this.props.name;
    },
    //on button click
    saveData() {
        ProcessAction.triggerAsync(this.props.actions);
    },
    //On value change
    setValue(e) {
        let nameArray=(this.props.name).split(".");
        if (e.target.type == 'checkbox') {
            if (e.target.checked) {
                appState.mount(nameArray, true);
                this.setState({ value: true });
            } else {
                appState.mount(nameArray, false);
                this.setState({ value: false });
            }

        } else {
            let value = e.target.value;
            appState.mount(nameArray, value);
            this.setState({ value });
        }
    },
    //On date value change
    setDateValue(e) {
         let nameArray=(this.props.name).split(".");
        let date = new Date(parseInt(e));
        let value = date.toUTCString();
        appState.mount(nameArray, value);
        //this.setState({ value });
    },


    populateElement() {
        let {type, name, label, Data} = this.props, control;
        switch (type) {
            case "TextBox":
                control = <FormGroup controlId="formControlsText"  >
                    <ControlLabel>{label}</ControlLabel>
                    <FormControl type="text" placeholder={label} value={this.state.value} ref="formcontrol" onChange={this.setValue} />
                </FormGroup>
                break;
            case "Email":
                control = <FormGroup controlId="formControlsEmail">
                    <ControlLabel>{label}</ControlLabel>
                    <FormControl type="email" placeholder={label} value={this.state.value} ref="formcontrol" onChange={this.setValue} />
                </FormGroup>
                break;

            case "Password":
                control = <FormGroup controlId="formControlsPassword">
                    <ControlLabel>{label}</ControlLabel>
                    <FormControl type="password" placeholder={label} value={this.state.value} ref="formcontrol" onChange={this.setValue} />
                </FormGroup>

                break;
            case "Textarea":
                control = <FormGroup controlId="formControlsTextarea">
                    <ControlLabel>{label}</ControlLabel>
                    <FormControl componentClass="textarea" placeholder={label} value={this.state.value} ref="formcontrol" onChange={this.setValue} />
                </FormGroup>
                break;
            case "DropDown":
                control = <FormGroup controlId="formControlsSelect" >
                    <ControlLabel>{label}</ControlLabel>
                    <FormControl componentClass="select" placeholder={label} value={this.state.value} ref="formcontrol" onChange={this.setValue} >
                        
                        {Data.map((val, i) => {
                            return <option value={val}>{val}</option>
                        }) }
                    </FormControl>
                </FormGroup>
                break;
            case "Date":
                //ref https://www.npmjs.com/package/react-bootstrap-date-picker
                control = <div style={{ float: 'left', position: 'relative' }}>
                    <ControlLabel>{label}</ControlLabel>
                    <DateTimeField  inputFormat="DD-MM-YYYY" value={this.state.value} onChange={this.setDateValue} />
                </div>
                break;
            case "DateTime":
                //ref https://www.npmjs.com/package/react-bootstrap-datetimepicker
                //ref http://dev.quri.com/react-bootstrap-datetimepicker/
                control = <div style={{ float: 'left', position: 'relative' }}>
                    <ControlLabel>{label}</ControlLabel>
                    <DateTimeField  value={this.state.value} onChange={this.setDateValue} />
                </div>
                break;
            case "multiSelect":
                //ref https://projects.skratchdot.com/react-bootstrap-multiselect/
                control = <div style={{ float: 'left', position: 'relative' }}>
                    <ControlLabel>{label}</ControlLabel>
                    <Multiselect style={{ width: '100%' }} data={this.state.value}  multiple />
                </div>
                break;
            case "YesNo":
                control = <Checkbox defaulValue={this.state.value==="true"?true:false} onChange={this.setValue}>
                    {label}
                </Checkbox>
                break;
            case "Button":
                control = <Button bsStyle="success" onClick={this.saveData}>Save</Button>
                break;
            default:
                control = ''
                break;
        }
        return control;
    },
    render() {
        let width = (this.props.colSpan * 100) / this.props.layoutColumnsCount;
        let style = {
            width: `${width}%`,
            display: 'inline-block',
            padding: '2px',
            float: 'left'
        }

        return <div style={style} onClick={this.getValues}>
            {this.populateElement() }
        </div>
    }

})

export default FormRenderer;