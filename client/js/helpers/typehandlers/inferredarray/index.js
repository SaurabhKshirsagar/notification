

import R from "ramda";
import _ from 'lodash';
import Immutable from 'Immutable';
import BaseCore from '../basecore'
import {makeField,tryValidate,getProp,inferSchema,makeError, ErrorTypes} from "helpers/BuilderApi";
import {getTypeHandler} from "helpers/createhandler";

class InferredArrayHandler extends BaseCore
{ 
  constructor(){
    super();
    this.type = this.coreType =  "@array";
    this.defaultSchemaJson =  {"type" : this.type};  
  }    
    fromValue(value){
        let result = [];
        for(let val of value) {    
            let inferredValueSchema = inferSchema(val),
            type = getProp(inferredValueSchema,"type"),
            handler = getTypeHandler(type);
            result.push(handler.fromValue(val,null));
        }
        
        return makeField(result, this.defaultSchemaJson);
    }
    prepareChildSchema(childSchema){
        let thisSchema = this.defaultSchemaJson;
        return childSchema;
    }
    toJSON(valueWhichIsField) {
        if (!this.isTypeCompatible(valueWhichIsField)) {
            return valueWhichIsField ? valueWhichIsField.toJSON() : null;
        }
        let result = [];
        if (valueWhichIsField) {
            let value = valueWhichIsField.get("value"),
                attributesKeys = Object.keys(value.toJSON());
            if(R.isNil(value)){
                return null;
            }
            for (let attributeKey of attributesKeys) {
                let attributeSchema = value.getIn([attributeKey, "schema"]),
                    attributeField = value.getIn([attributeKey]),
                    type = getProp(attributeSchema, "type"),
                    handler = getTypeHandler(type),
                    attributeToJson = handler.toJSON(attributeField);
                result.push(attributeToJson);
            }

        } else {
            throw 'can not find toJSON() for undefined type field';
        }
        return result;
    }
}

export default InferredArrayHandler;