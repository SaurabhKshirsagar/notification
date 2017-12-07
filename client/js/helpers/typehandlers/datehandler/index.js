import R from "ramda";
import _ from 'lodash';
import Immutable from 'Immutable';
import BaseCore from '../basecore';
import {
    resolveRequired,
    resolveMin,
    resolveMax,
    resolveDefaultValue,
    resolveAllowsNull,
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
import moment from "moment";
const validPatterns = {
    "/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|99)\d{2}$/": true
},
    resolvers = {
        "required": resolveRequired,
        "min": resolveMin,
        "max": resolveMax,

        "defaultValue": resolveDefaultValue,
        "allowsNull": resolveAllowsNull,
        "patternValidation": resolvePatternValidation
    };
class DateHandler extends BaseCore {
    constructor() {
        super();
        this.defaultSchemaJson = jsonSchema;
        this.type = this.coreType = jsonSchema.type;
        this.validations = {
            "type": (value) => _.isNull(value) || _.isNumber(value) ? null : makeError(ErrorTypes.typeMismatch, errorMessageProviders.type()),
            "required": (value) => {
                if (this.defaultSchemaJson.required)
                    return R.isEmpty(value) ? makeError(ErrorTypes.required, errorMessageProviders.required()) : null;
                return null;
            },
            "min": (value) => {
                console.log("min");
                return R.gte(value, this.defaultSchemaJson.min) ?
                            null : 
                                makeError(ErrorTypes.min, errorMessageProviders.min(this.defaultSchemaJson),{"min":this.defaultSchemaJson.min})
            },
            "max": (value) => R.lte(value, this.defaultSchemaJson.max) ? null : makeError(ErrorTypes.max, errorMessageProviders.max(this.defaultSchemaJson),{"max":this.defaultSchemaJson.max}),
            "patternValidation": (value) => {
                let pattern = this.defaultSchemaJson.patternValidation;
                if (!validPatterns[pattern]) {
                    return makeError(ErrorTypes.patternValidation, errorMessageProviders.patternValidation(this.defaultSchemaJson))
                }
                return null;
            }
        };
        this.resolvers = resolvers;
        this.validationOrder = [this.validations.type,
        this.validations.required,
        this.validations.min,
        this.validations.max,
        this.validations.patternValidation
        ]
    };
    fromValue(value, schemaOverride = null) {
        let schema = this.defaultSchemaJson;
        if (schemaOverride) {
            schema = this.resolveSchema(schemaOverride);
        }

        value=value?value:(schema.defaultValue?schema.defaultValue:null);

        for (let order of this.validationOrder) {
            let hasError = order(value);

            if (hasError) {
                return makeField(value, schema, hasError);
            }
        };
    //    value = value.getTime() / 1000; //to unix epoch
        return makeField(value, schema)
    };
    prepareChildSchema(childSchema) {
        let thisSchema = this.defaultSchemaJson;
        childSchema.type =childSchema.type || this.defaultSchemaJson.type; 
        childSchema.defaultValue = childSchema.defaultValue || null;
        childSchema.required = childSchema.required || false;
        childSchema.min = Math.max(0, childSchema.min);
        childSchema.max = Math.min(thisSchema.max, childSchema.max);
        childSchema.allowsNull = childSchema.allowsNull || false;
         childSchema.format = childSchema.format || this.defaultSchemaJson.format;
        return childSchema;
    }
    getFormattedValue(field, formatOverride=null,rawValue=null){
        let schema = field ? field.get("schema") : null,
         format = schema ? getProp(schema,"format"):null,
         //value =  getProp(schema,"value");
        value = rawValue||this.toJSON(field);
        
        //value is empty or null then return the null value.
        if(R.isEmpty(value) || R.isNil(value)){
            return null;
            
        }

        if(formatOverride) {
            format = formatOverride;
        }

      
        // let momentInstance = moment(value,format,true);

        // if(!momentInstance.isValid()){
        //     throw `The date value "${value}" could not be converted into "${format}" format`; 
        // }
        let momentInstance = moment(value);
        return momentInstance.format(format);
    }
    getRawValue(formattedValueAsString, field, formatOverride=null){
        let schema =  getProp(field,"schema"),
        format = getProp(schema,"format");
        if(formatOverride){
            format = formatOverride;
        }
        if(!formattedValueAsString){
            throw `The value "${formattedValueAsString}" is not valid.`;
        }
        let momentInstance= moment(formattedValueAsString,format,true)
        if(!momentInstance.isValid()){
            throw `The date value "${formattedValueAsString}" could not be converted into "${format}" format`;
        }
    //    let result = momentInstance.valueOf() == "Invalid date" ? null : momentInstance.valueOf();
    //    return result;
       return momentInstance.valueOf();
    }
}

export default DateHandler;