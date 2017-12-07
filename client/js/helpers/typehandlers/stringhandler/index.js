import R from "ramda";
import _ from 'lodash';
import Immutable from 'Immutable';
import BaseCore from '../basecore'
import {resolveRequired, resolveMinLength, resolveMaxLength, resolveDefaultValue, resolveAllowsNull,resolveFormat, resolvePatternValidation} from '../resolvers'
import {makeField, tryValidate, getProp, ErrorTypes,makeError} from "helpers/BuilderApi";
import jsonSchema from "./schema";
import errorMessages from "helpers/typehandlers/errorMessages";
import errorMessageProviders from "helpers/typehandlers/errormessageproviders";
import SingleValue from "helpers/typehandlers/singlevalue";
import {Set} from "immutable";

const resolvers = {
        "required": resolveRequired,
        "minLength": resolveMinLength,
        "maxLength": resolveMaxLength,
        "defaultValue": resolveDefaultValue,
        "allowsNull": resolveAllowsNull,
        "format":resolveFormat,
        "patternValidation": resolvePatternValidation
    };
    
class StringHandler extends BaseCore {
    constructor() {
        super();
        this.defaultSchemaJson = jsonSchema;
        this.type = this.coreType = jsonSchema.type;
        this.domain=jsonSchema.domain?new Set(jsonSchema.domain):null;
        this.validations = {
            "type" :(value) =>  (_.isNull(value) || _.isString(value)) ? null : makeError(ErrorTypes.typeMismatch, errorMessageProviders.type()),
            "required": (value, schema) => {
                if (schema.required)
                    return R.isEmpty(value) || R.isNil(value)? makeError(ErrorTypes.required, errorMessageProviders.required()) : null;
                return null;
            },
            "minLength": (value, schema) => {
                if (value == null){
                    return null;
                }
                return R.gte(value.length, schema.minLength) ? null : makeError(ErrorTypes.minLength, errorMessageProviders.minLength(schema),{"minLength":schema.minLength});
            },
            "maxLength": (value, schema) => {
                if (value == null){
                    return null;
                }
                return R.lte(value.length, schema.maxLength) ? null : makeError(ErrorTypes.maxLength, errorMessageProviders.maxLength(schema),{"maxLength":schema.maxLength});
            },
            "patternValidation": (value, schema) => {
                if (value == null){
                    return null;
                }
                for (let exp of schema.patternValidation) {
                    var regExp = new RegExp(exp);
                    if (!value.match(regExp))
                        return makeError(ErrorTypes.patternValidation, errorMessageProviders.patternValidation(schema))
                }
                return null;
            },
             "domainValidation":(value,schema=null)=>( !schema || !(schema.domain) || schema.domain.has(value) ) ? null :makeError(ErrorTypes.domainError, errorMessageProviders.domainError(this.defaultSchemaJson))
                
                
        };
        this.resolvers = resolvers;
        this.validationOrder = [this.validations.required,
                                this.validations.type,
                                this.validations.minLength,
                                this.validations.maxLength,
                                this.validations.patternValidation,
                                this.validations.domainValidation
                                ]
    };
    fromValue(value, schemaOverride = null) {
        
        
        let schema = this.defaultSchemaJson;
        if (schemaOverride) {
            schema = this.resolveSchema(schemaOverride);
        }
        value=value?value:(schema.defaultValue?schema.defaultValue:
                (schema.domain?  ( Set.isSet(schema.domain)? schema.domain.first():schema.domain[0]):null));

        for (let order of this.validationOrder) {
            let hasError = order?order(value, schema):null;
            
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
        childSchema.defaultValue = childSchema.defaultValue || null;
        childSchema.format = childSchema.format || null;
        childSchema.required = childSchema.required || false;
        childSchema.minLength = childSchema.minLength ? Math.max(thisSchema.minLength, childSchema.minLength) : thisSchema.minLength;
        childSchema.maxLength = childSchema.maxLength ? Math.min(thisSchema.maxLength, childSchema.maxLength) : thisSchema.maxLength;
        childSchema.allowsNull = childSchema.allowsNull || false;
        childSchema.domain=this.resolveDomains(childSchema,thisSchema);
        return childSchema;
    }
    getRawValue(formattedValueAsString,field){
        return formattedValueAsString;
    }
   getFormattedValue(field, formatOverride=null,value=null){
      return value || this.toJSON(field);
  }
}

export default StringHandler;

        