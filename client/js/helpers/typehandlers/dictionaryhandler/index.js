import R from "ramda";
import _ from 'lodash';
import Immutable from 'Immutable';
import BaseCore from 'helpers/typehandlers/basecore';

import {makeField,tryValidate,inferSchema,makeError,ErrorTypes,getProp} from "helpers/BuilderApi";
import typeHandler from "helpers/typehandlers";
import {getTypeHandler} from "helpers/createhandler";
import typeHandlers from "helpers/typehandlers";
import jsonSchema from "./schema";
import errorMessages from "helpers/typehandlers/errorMessages";
import errorMessageProviders from "helpers/typehandlers/errormessageproviders";

let resolver = R.curry((prop, fn, left, right) => fn(left[prop], right[prop])),
    resolveRequired = resolver("required", R.or);

const validationOrder = ["type", "required"],

    resolvers = {
        "required": resolver("required", R.or),
        "defaultValue": resolver("defaultValue", R.or),
    };

class DictionaryHandler extends BaseCore {
    constructor() {
        super();
        this.defaultSchemaJson = jsonSchema;
        this.type = this.coreType = jsonSchema.type;
        this.validations = {
            "required": (value) => {
                if (this.defaultSchemaJson.required) {
                    return R.isEmpty(value) ? makeError(ErrorTypes.required, errorMessageProviders.required) : null;
                }
                return null;
            },
            "type": (value) => {
                return !(_.isNull(value) || _.isObject(value)) ? makeError(ErrorTypes.typeMismatch, errorMessageProviders.type) : null;
            }
        }
        this.resolvers = resolvers;
    }

    fromValue(value, schemaOverride = null) {
        let schema = this.defaultSchemaJson,
            result, error = null;
        if (schemaOverride) {
            let schemaOverrideType = getProp(schemaOverride, "type");
            if (schemaOverrideType != this.type) {
                throw `The schema type "${schemaOverrideType}" does not match this handler's type "${this.type}"`;
            }
            schema = this.resolveSchema(schemaOverride);
        }
        let field = dictionaryTypeConverter(schema, value);
        result = field.get("value");
        error = field.get("error");

        
        if (error == null) {

            for (let order of validationOrder) {
                let applicableTypeValidations = this.validations[order];

                if (applicableTypeValidations) {
                    let hasError = applicableTypeValidations(value);

                    if (hasError) {
                        error = hasError;
                        break;

                    }
                }
            }
        }

        return makeField(result, schema, error);
    }

    prepareChildSchema(childSchema) {
        childSchema.type = childSchema.type || this.defaultSchemaJson.type;
        childSchema.defaultValue = childSchema.defaultValue || null;
        childSchema.required = childSchema.required || false;

        return _.merge(this.defaultSchemaJson, childSchema);
    }
    toJSON(valueWhichIsField) {
        if (!this.isTypeCompatible(valueWhichIsField)) {
            return valueWhichIsField ? valueWhichIsField.get("value").toJSON() : null;
        }
        let result = {};
        if (valueWhichIsField) {
            let value = valueWhichIsField.get("value");
            if (R.isNil(value)) {
                return null;
            }
            let attributesKeys = Object.keys(value.toJSON());

            for (let attributeKey of attributesKeys) {
                let attributeSchema = value.getIn([attributeKey, "schema"]),
                    attributeField = value.getIn([attributeKey]),
                    type = getProp(attributeSchema, "type"),
                    handler = getTypeHandler(type),
                    attributeToJson = handler.toJSON(attributeField);
                result[attributeKey] = attributeToJson;
            }

        } else {
            throw 'can not find toJSON() for undefined type field';
        }
        return result;
    }
}


let dictionaryTypeConverter = (schema, value) => {
    if (_.isEmpty(value)) {
        return makeField(null, schema);
    }
    // if (!_.isArray(value)) {
    //     return makeField(value, schema, makeError(ErrorTypes.typeMismatch, "type mistmatch"));
    // }
    let of = getProp(schema, "of"),
        result = {},
        error = null,
        hasMemberError = false,
        type = of,
        handler = getTypeHandler(type),
        typeOfKey = getProp(schema,"key");

    for (let key in value) {
        let arrayValue = value[key];
        //check the key type 
        let keyField = validateKey(schema,key);
        let keyError = keyField.get("error");

        if(keyError){
            let error = makeError(ErrorTypes.keyMissMatch, "key missmatch");
            let fieldWithError = makeField(arrayValue,schema,error,);
            result[key] = fieldWithError;
            hasMemberError = true;
            continue;

        }
        
        let entityField = handler.fromValue(arrayValue);
        result[key] = entityField;
        hasMemberError |= !!entityField.get("error");
    }

    if (hasMemberError) {
        error = makeError(ErrorTypes.memberError, "member error");
    }

    return makeField(result, schema, error);
}

let validateKey = (schema, keyValue)=>{
    let {key:type} = schema,
    handler = getTypeHandler(type);
    return handler.fromValue(keyValue);

}
export default DictionaryHandler;