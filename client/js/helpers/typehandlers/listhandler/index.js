import R from "ramda";
import _ from 'lodash';
import Immutable from 'Immutable';
import BaseCore from 'helpers/typehandlers/basecore';

import {
    makeField,
    tryValidate,
    inferSchema,
    makeError,
    fromModel,
    ErrorTypes,
    getProp,

} from "helpers/BuilderApi";
import typeHandler from "helpers/typehandlers";
import {
    getTypeHandler
} from "helpers/createhandler";
import typeHandlers from "helpers/typehandlers";
import {
    getEntitySchema
} from "engine/Db/contexts/schemas";

import {
    resolveRequired,
    resolveMinLength,
    resolveMaxLength,
    resolveDefaultValue,
    resolveAllowsNull,
    resolveFormat,
    resolvePatternValidation
} from '../resolvers'
import jsonSchema from "./schema";
import errorMessages from "helpers/typehandlers/errorMessages";
import errorMessageProviders from "helpers/typehandlers/errormessageproviders";

const validationOrder = ["type", "required", "minLength", "maxLength"],

    resolvers = {
        "required": resolveRequired,
        "defaultValue": resolveDefaultValue,
        "minLength": resolveMinLength,
        "maxLength": resolveMaxLength
    };

class ListHandler extends BaseCore {
    constructor() {
        super();
        this.type = this.coreType = jsonSchema.type;
        this.defaultSchemaJson = jsonSchema;
        this.validations = {
            "required": (value) => {
                if (this.defaultSchemaJson.required) {
                    return R.isEmpty(value) ? makeError(ErrorTypes.required, errorMessageProviders.required) : null;
                }
                return null;
            },
            "type": (value) => {
                return !(_.isNull(value) || _.isArray(value)) ? makeError(ErrorTypes.typeMismatch, errorMessageProviders.type) : null;
            },
            "minLength": (value) => {
                if (value == null) {
                    return null;
                }
                return R.gte(value.length, this.defaultSchemaJson.minLength) ?
                    null :
                    makeError(ErrorTypes.minLength, errorMessageProviders.minLength(this.defaultSchemaJson), { "minLength": this.defaultSchemaJson.minLength });
            },
            "maxLength": (value) => {
                if (value == null) {
                    return null;
                }
                return R.lte(value.length, this.defaultSchemaJson.maxLength) ?
                    null :
                    makeError(ErrorTypes.maxLength, errorMessageProviders.maxLength(this.defaultSchemaJson), { "maxLength": this.defaultSchemaJson.maxLength });
            }
        }
        this.resolvers = resolvers;
    }

    fromValue(value, schemaOverride = null) {
        // For a list, the "of" always comes in the schemaOverride.
        // we therefore need to merge it with the defaultSchema to
        // create the final schema.
       
        let schema = this.defaultSchemaJson,
            result, error = null;
        // let schema = this.resolveSchema(schemaOverride),
        //     result, error = null;
        if (schemaOverride) {
            let schemaOverrideType = getProp(schemaOverride, "type");
            if (schemaOverrideType != this.type) {
                throw `The schema type "${schemaOverrideType}" does not match this handler's type "${this.type}"`;
            }
            schema = this.resolveSchema(schemaOverride);
        }
        
        let field = listTypeConverter(schema, value);
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
        childSchema.defaultValue = childSchema.defaultValue || null;
        childSchema.required = childSchema.required || false;
        childSchema.minLength = childSchema.minLength || this.defaultSchemaJson.minLength;
        childSchema.maxLength = childSchema.maxLength || this.defaultSchemaJson.maxLength;
        return childSchema;
        //return _.merge(this.defaultSchemaJson, childSchema);
    }
    toJSON(valueWhichIsField) {
        if (!this.isTypeCompatible(valueWhichIsField)) {
            return valueWhichIsField ? valueWhichIsField.toJSON() : null;
        }
        let result = [];
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
                result.push(attributeToJson);
            }

        } else {
            throw 'can not find toJSON() for undefined type field';
        }
        return result;
    }
}

let listTypeConverter = (schema, value) => {
    if (_.isEmpty(value)) {
        return makeField(null, schema);
    }
    // if (!_.isArray(value)) {
    //     return makeField(value, schema, makeError(ErrorTypes.typeMismatch, "type mistmatch"));
    // }
    let of = getProp(schema, "of"),
        result = [],
        error = null,
        hasMemberError = false,
        type = of,
        handler = getTypeHandler(type);
    for (let key in value) {
        let arrayValue = value[key];
        let entityField = handler.fromValue(arrayValue);
        result.push(entityField);
        hasMemberError |= !!entityField.get("error");
    }

    if (hasMemberError) {
        error = makeError(ErrorTypes.memberError, "member error");
    }

    return makeField(result, schema, error);
}

export default ListHandler;