

import R from "ramda";
import _ from 'lodash';
import Immutable from 'Immutable';
import BaseCore from '../basecore'
import {makeField,tryValidate,getProp,inferSchema, makeError,ErrorTypes} from "helpers/BuilderApi";
import {getTypeHandler} from "helpers/createhandler";

class InferredComplexHandler extends BaseCore
{ 
  constructor(){
    super();
    this.type = this.coreType = "@complex";
    this.defaultSchemaJson = {"type" : this.type};
  }
    fromValue(value){
        let result = {},keys = Object.keys(value);
       
        for (let key of keys){
            let val = value[key];
            let inferredValueSchema = inferSchema(val),
            type = getProp(inferredValueSchema,"type"),
            handler = getTypeHandler(type);
            result[key] = handler.fromValue(val);
        }

        return makeField(result, this.defaultSchemaJson);
    }
    prepareChildSchema(childSchema){
        
        let thisSchema = this.defaultSchemaJson;
        return childSchema;
    }
     toJSON(valueWhichIsField){
          if(!this.isTypeCompatible(valueWhichIsField)){
           return valueWhichIsField ? valueWhichIsField.get("value").toJSON() : null;
        }
        let result = {};
        if(valueWhichIsField){
            let value = valueWhichIsField.get("value");
            if (R.isNil(value)) {
                return null;
            }
            let attributesKeys = Object.keys(value.toJSON());
            
            for(let attributeKey of  attributesKeys){
                let attributeSchema = value.getIn([attributeKey,"schema"]),
                attributeField = value.getIn([attributeKey]),
                type = getProp(attributeSchema,"type"),
                handler = getTypeHandler(type),
                attributeToJson = handler.toJSON(attributeField);
                result[attributeKey] = attributeToJson;
            }
            
        }else{
            throw 'can not find toJSON() for undefined type field';
        }
        return result;
    }
}

export default InferredComplexHandler;