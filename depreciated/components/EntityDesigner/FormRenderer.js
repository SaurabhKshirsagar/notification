import React from 'react';
let FormRendere = React.createClass({
    render:function(){
        let dailogBody = '';
        if (this.props.entityFields) {
            let entity = this.props
            dailogBody = this.props.entityFields.map((key, value) => {
                let controlId = `formControlsText${value}`;
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
                            onChange={this.onChangeControl} key={key.field}/>
                    </FormGroup>
                );
            });
        }
        return(
            <div>{dailogBody}</div>
        );
    }
});