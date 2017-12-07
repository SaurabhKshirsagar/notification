import R from "ramda";
import _ from 'lodash';
import Immutable from 'Immutable';
import BaseCore from 'helpers/typehandlers/basecore';

import {makeField,tryValidate,inferSchema,makeError,fromModel,ErrorTypes,getProp} from "helpers/BuilderApi";
import typeHandler from "helpers/typehandlers";
import {getTypeHandler} from "helpers/createhandler";
import typeHandlers from "helpers/typehandlers";
import jsonSchema from "./schema";
import errorMessages from "helpers/typehandlers/errorMessages";
import errorMessageProviders from "helpers/typehandlers/errormessageproviders";
import {getEntitySchema} from "engine/Db/contexts/schemas";

let resolver = R.curry((prop, fn, left, right) => fn(left[prop], right[prop])),
    resolveRequired = resolver("required", R.or);

const validationOrder = ["type", "required"],

    resolvers = {
        "required": resolver("required", R.or),
        "defaultValue": resolver("defaultValue", R.or),
    };

class ComplexHandler extends BaseCore {
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
        let field = complexTypeConverter(schema, value);
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
        return childSchema;
        //return _.merge(this.defaultSchemaJson, childSchema);
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

let complexTypeConverter = (schema, value) => {
    if (_.isEmpty(value)) {
        return makeField(null, schema);
    }
    //let{type} = childSchema;
    
  //  let schema = getEntitySchema(type);

    let valueKeys = Immutable.Set(Object.keys(value)),
        result = {},
        error = null,
        attributes = getProp(schema, "attributes"),
        hasMemberError = false;
        
        if(!attributes){
            let{type} = schema;
            schema = getEntitySchema(type);
            attributes = getProp(schema,"attributes")
        }
    for (let attributeSchema of attributes) {
        let {name,type} = attributeSchema, schemaOverride, attributeField,
        attributeValue = value[name];

        if (attributeValue) {
            let handler = getTypeHandler(type, attributeSchema);
            attributeField = handler.fromValue(attributeValue, attributeSchema);
            result[name] = attributeField;
            hasMemberError |= !!attributeField.get("error");
            valueKeys = valueKeys.delete(name);
        } else {
            let error = makeError(ErrorTypes.typeMismatch, errorMessages.type);
            let field = makeField(null, attributeSchema, error);
            result[name] = field;
        }
    }
    for (let valueKey of valueKeys) {
        let val = value[valueKey],
            hasValueSchema = false;
        for (let attributeSchema of attributes) {
            let {
                name
            } = attributeSchema;

            if (name === valueKey) {
                schema = attributeSchema;
                hasValueSchema = true;
                break;
            }
        }
        if (hasValueSchema) {
            let type = getProp(schema, "type");
            let handler = getTypeHandler(type);
            result[valueKey] = handler.fromValue(value[valueKey], schema);
            hasMemberError |= !!result[valueKey].get("error");
        } else {
            error = makeError(ErrorTypes.memberError, "member not present error");
           // hasMemberError = true;
        }
    }
    if (hasMemberError) {
        error = makeError(ErrorTypes.memberError, "member error");
    }
    return makeField(result, schema, error);
}

export default ComplexHandler;