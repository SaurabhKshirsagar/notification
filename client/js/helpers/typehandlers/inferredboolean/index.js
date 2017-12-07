import R from "ramda";
import _ from 'lodash';
import Immutable from 'Immutable';
import BaseCore from '../basecore'
import {
    makeField,
    tryValidate,
    getProp
} from "helpers/BuilderApi";

class InferredBooleanHandler extends BaseCore {
    constructor() {
        super();
        this.defaultSchemaJson = {
            "type": "@boolean"
        };
        this.type = this.coreType = this.defaultSchemaJson.type;
    };
    fromValue(value, schemaOverride = null) {
        let schema = this.defaultSchemaJson;
        if (schemaOverride) {
            schema = this.resolveSchema(schemaOverride);
        }

        return tryValidate(R.or(_.isNull, _.isBoolean), value, 'type mismatch.', schema);
    };
    prepareChildSchema(childSchema) {

        let thisSchema = this.defaultSchemaJson;
        return childSchema;
    }
    getRawValue(formattedValueAsString,field){
        return this.toJSON(field);
    }
  getFormattedValue(field, formatOverride=null){
      
      return this.toJSON(field);
  }
  
}

export default InferredBooleanHandler;