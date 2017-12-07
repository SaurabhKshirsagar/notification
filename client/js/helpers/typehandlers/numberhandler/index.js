import R from "ramda";
import _ from 'lodash';
import Immutable from 'Immutable';
import BaseCore from '../basecore'
import {
    resolveRequired,
    resolveMin,
    resolveMax,
    resolveDefaultValue,
    resolveAllowsNull,
    resolveFormat,
    resolvePatternValidation
} from '../resolvers'
import {
    makeField,
    tryValidate,
    getProp,
    ErrorTypes,
    makeError
} from "helpers/BuilderApi";
import jsonSchema from "./schema";
import errorMessages from "helpers/typehandlers/errorMessages";
import errorMessageProviders from "helpers/typehandlers/errormessageproviders";
import SingleValue from "helpers/typehandlers/singlevalue";

import numeral,{validate} from "numeral";

const resolvers = {
    "required": resolveRequired,
    "min": resolveMin,
    "max": resolveMax,
    "defaultValue": resolveDefaultValue,
    "allowsNull": resolveAllowsNull,
    "format": resolveFormat,
    "patternValidation": resolvePatternValidation
};
import {Set} from "immutable";

class NumberHandler extends BaseCore {
    constructor() {
        super();
        this.type = this.coreType = jsonSchema.type,
            this.defaultSchemaJson = jsonSchema;
            this.domain=jsonSchema.domain?new Set(jsonSchema.domain):null;
        this.validations = {
            "type": (value,schema) => (_.isNull(value) || _.isNumber(value)) ? null : makeError(ErrorTypes.typeMismatch, errorMessageProviders.type()),
            "required": (value,schema) => {
                if (schema.required)
                    return R.isEmpty(value) ? makeError(ErrorTypes.required, errorMessageProviders.required()) : null;
                return null;
            },
            "min": (value,schema) => R.gte(value, schema.min) ? null : makeError(ErrorTypes.min, errorMessageProviders.min(schema),{"min":schema.min}),
            "max": (value,schema) => R.lte(value, schema.max) ? null : makeError(ErrorTypes.max, errorMessageProviders.max(schema),{"max":schema.max}),
            "domainValidation":(value,schema=null)=>( !schema || !(schema.domain) || schema.domain.has(value) ) ? null :makeError(ErrorTypes.domainError, errorMessageProviders.domainError(this.defaultSchemaJson))
            
        };
        this.resolvers = resolvers;
        this.validationOrder = [this.validations.type,
            this.validations.required,
            this.validations.min,
            this.validations.max,
            this.validations.domainValidation
           
        ]
    };
    fromValue(value, schemaOverride = null) {
        let schema = this.defaultSchemaJson;
        if (schemaOverride) {
            schema = this.resolveSchema(schemaOverride);
        }
        if(isNaN(Number(value))){
            return makeField(value, schema, makeError(ErrorTypes.typeMismatch, errorMessageProviders.type()));
        }
        value=value ? Number(value) : null;
        for (let order of this.validationOrder) {
            let hasError = order?order(value,schema):null;
            if (hasError) {
                return makeField(value, schema, hasError);
            }
        }
        return makeField(value, schema)
    };
     resolveDomains(childSchema=null,parentSchema=null){
  
        if(childSchema!=null || parentSchema!=null)
        {
            if((childSchema&&childSchema.domain)&&(parentSchema && parentSchema.domain))
                return new Set(childSchema.domain).merge(parentSchema.domain);
            else if(childSchema&&childSchema.domain)return new Set(childSchema.domain);
            else if(parentSchema && parentSchema.domain) return new Set(parentSchema.domain);
            
        }
        return null;
    }
    prepareChildSchema(childSchema) {
        let thisSchema = this.defaultSchemaJson;
        childSchema.type = childSchema.type || thisSchema.type;
        childSchema.defaultValue = childSchema.defaultValue || null;
        childSchema.format = childSchema.format || null;
        childSchema.required = childSchema.required || false;
        childSchema.min = childSchema.min ? Math.max(thisSchema.min, childSchema.min) : thisSchema.min;
        childSchema.max = childSchema.max ? Math.min(thisSchema.max, childSchema.max) : thisSchema.max;
        childSchema.allowsNull = childSchema.allowsNull || false;
        childSchema.format = childSchema.format || this.defaultSchemaJson.format;
        childSchema.domain=this.resolveDomains(childSchema,thisSchema);
        return childSchema;
    }
     getFormattedValue(field, formatOverride=null){
        let schema = field.get("schema"),
         format = getProp(schema,"format"),
        value = this.toJSON(field);
        if(formatOverride) {
            format = formatOverride;
        }
        if(!_.isNumber(value)){
           return "";
        }
        return numeral(value).format(format);
    }
    getRawValue(formattedValueAsString, field, formatOverride=null){
        let schema =  getProp(field,"schema"),
        format = getProp(schema,"format");
        if(formatOverride){
            format = formatOverride;
        
    }
        
        if(R.isEmpty(formattedValueAsString) || R.isNil(formattedValueAsString)){
            return null;
        }
        if(!validate(formattedValueAsString,format)){
            throw `The value "${formattedValueAsString}" is not support for the format "${format}"`;
        }
        return numeral().unformat(formattedValueAsString);
    }
}

export default NumberHandler;