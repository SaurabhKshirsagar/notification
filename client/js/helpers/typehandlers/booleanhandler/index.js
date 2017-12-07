
import R from "ramda";
import _ from 'lodash';
import Immutable from 'Immutable';

import { makeField, tryValidate, getProp, ErrorTypes, makeError } from "helpers/BuilderApi";
import BaseCore from '../basecore';
import jsonSchema from "./schema";
import errorMessages from "helpers/typehandlers/errorMessages";
import errorMessageProviders from "helpers/typehandlers/errormessageproviders";

class BooleanHandler extends BaseCore{
  constructor() {
    super();
    this.defaultSchemaJson = jsonSchema;
    this.type = this.coreType = jsonSchema.type;
    this.validations = {
      "type": (value, schema = null) => _.isBoolean(value) ?
        null :
        makeError(ErrorTypes.typeMismatch, errorMessageProviders.type())
    };

    this.validationOrder = [this.validations.type];
  }
  fromValue(value, schemaOverride = null) {
 
    let schema = this.defaultSchemaJson;
    
        if (schemaOverride) {
            let schemaOverrideType = getProp(schemaOverride, "type");
            if (schemaOverrideType != this.type){
                throw `The schema type "${schemaOverrideType}" does not match this handler's type "${this.type}"`;
            }
            schema = this.resolveSchema(schemaOverride);
        }

        value=value?value:(schema.defaultValue?schema.defaultValue:false);

    for (let order of this.validationOrder) {

      let hasError = order(value, schema);
      if (hasError) {
        return makeField(value, schema, hasError);
      }
    }
    return makeField(value, schema)
  }
 

  prepareChildSchema(childSchema) {
        let thisSchema = this.defaultSchemaJson;
        childSchema.type = childSchema.type || this.defaultSchemaJson.type;
        childSchema.defaultValue = childSchema.defaultValue || false;
        childSchema.required = childSchema.required || false;
        childSchema.allowsNull = childSchema.allowsNull || false;
        return _.merge(this.defaultSchemaJson,childSchema);
    }

  toNumber(value) {
    return _.isBoolean(value) ? (value ? 1 : 0) : (R.is(String, value) ? (value == "false" ? 0 : 1) : null);
  }
  getRawValue(formattedValueAsString,field){
        return formattedValueAsString;
    }
  getFormattedValue(field, formatOverride=null){
      
      return this.toJSON(field);
  }
}


module.exports = BooleanHandler;

