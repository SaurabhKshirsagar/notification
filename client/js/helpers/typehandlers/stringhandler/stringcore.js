import R from "ramda";
import _ from 'lodash';
import Immutable from 'Immutable';
import {makeField,tryValidate} from "helpers/BuilderApi";

let resolver = R.curry((prop, fn, left, right) => fn(left[prop], right[prop])),
resolveRequired = resolver("required", R.or),
resolveMinLength = resolver("minLength", Math.max),
resolveMaxLength = resolver("maxLength", Math.min),
resolveDefaultValue = resolver("defaultValue", R.or),
resolveAllowsNull = resolver("allowsNull", R.or),
resolvePatternValidation = resolver("patternValidation", R.or);

const jsonSchema={
        defaultValue:null,
        minLength:0,
        maxLength:1000000,
        required: false,
        allowsNull:true,
        patternValidation:true
    },
    validations = {
        "required" : (value) => {   
            if(this.defaultSchemaJson.required) 
                    return !R.isEmpty(value) 
            return true
        },
        "minLength" : (value)=> R.gte(value.length,this.defaultSchemaJson.minLength),
        "maxLength" : (value)=> R.lte(value.length,this.defaultSchemaJson.maxLength)
    },
    resolvers= {"required" : resolveRequired, 
                "minLength" : resolveMinLength, 
                "maxLength" : resolveMaxLength,
                "defaultValue" : resolveDefaultValue,
                "allowsNull" : resolveAllowsNull,
                "maxLepatternValidationngth" : resolvePatternValidation
    };


class StringCore 
{
  constructor(){
    this.defaultSchemaJson =  jsonSchema;
    this.validations = validations;
    this.resolvers = resolvers;
  };    
    fromValue(value){ 
        return tryValidate(R.either(_.isNull, _.isString),value,'type mismatch.',this.defaultSchemaJson)
    };
    toString(field){
       return  _.isString(field.value) ? field.value : null;
    };
    clone(field){
        return field.clone();
    };
    resolveSchema(childSchema){
        let result = {},
        thisSchema = this.defaultSchemaJson;
        childSchema = this.prepareChildSchema(childSchema);
        for (let key in this.resolvers){
            result[key] = this.resolvers[key](childSchema, thisSchema);
        }
        return result;
    }
    prepareChildSchema(childSchema){
        childSchema.defaultValue =childSchema.defaultValue || null;
        childSchema.required = childSchema.required || false;
        childSchema.minLength = Math.max(0, childSchema.minLength);
        childSchema.maxLength = Math.min(thisSchema.maxLength, childSchema.maxLength);
        childSchema.allowsNull =childSchema.allowsNull || false;
        childSchema.patternValidation =childSchema.patternValidation || false;
        return childSchema;
    }
 
}
 

export default StringCore;
