import R from "ramda";
import _ from "lodash";
import Immutable from "Immutable";
import {tryValidate} from "helpers/builderApi";

let numberCore = function() {
    this.validations = {
        "required" : (value) => {   
            if(this.defaultSchemaJson.required) 
            return !R.isEmpty(value) 
            return true
        },
        "min" : (value)=> R.gte(value,this.defaultSchemaJson.min),
        "max" : (value)=> R.lte(value,this.defaultSchemaJson.max)
    };
    this.fromValue = (value) => tryValidate(R.either(_.isNull, _.isNumber),value,'type mismatch.',this.defaultSchemaJson); 
    this.toString = (field)=> {
        _.isNumber(field.value)
        return field.value
    };
    this.clone = (field) => _.cloneDeep(field);
    this.resolveSchema= (childSchema) => schema;
}

export default numberCore;