import React from "react";
import { getField } from "appcontext";
import { FormControl} from 'react-bootstrap';

let render = function () {
    let style, type = { type: "text" };
    if(this.state.props.secureTextEntry)
        type = { type: "password" };
    if (this.state.props.line > 1) {
        style = { height: `${this.state.props.line * 25}px` };
        type = { componentClass: "textarea" };
    }
    if (this.state.propLenses && this.state.propLenses.dataSource) {
        let field = this.state.propLenses.dataSource ? getField(this.state.propLenses.dataSource) : null;
        if (field.getIn(["schema", "type"]) == 'number') {
            let {min, max} = field.getIn(["schema"]).toJSON();
            min = this.state.props.min ? Math.max(this.state.props.min, min) : min
            max = this.state.props.max ? Math.min(this.state.props.max, max) : max;
            type = {
                type: "number",
                min,
                max,
                step: this.state.props.step
            };
        }

    }
    return <div >
        <FormControl
            componentClass="input"
            placeholder={this.state.props.placeholder}
            inputRef={(ref) => { if (ref) ref.focus() } }
            onChange={this.implicitActions.onChange.bind(this) }
            onClick={this.implicitActions.onClick.bind(this) }
            onFocus={this.implicitActions.onFocus.bind(this) }
            onBlur={this.implicitActions.onBlur.bind(this) }
            value={this.state.props.dataSource}
            disabled={this.state.props.disabled}
            style={this.style}
            {...this.type}/>
    </div>
}

export default render;