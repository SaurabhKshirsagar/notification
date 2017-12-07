import R from "ramda";
import _ from 'lodash';
import Immutable from 'Immutable';
import {
    makeField,
    tryValidate,
    getProp,
    getFieldValueAsJSON,
    ErrorTypes
} from "helpers/BuilderApi";

class BaseCore {
    constructor() {}

    toString(field) {

        let fieldValue = getFieldValueAsJSON(field);
        return _.isString(fieldValue) ? fieldValue : R.toString(fieldValue);
    }
    clone(field) {
        return _.cloneDeep(field);
    }
    resolveSchema(childSchema) {

        let result = {},
            thisSchema = this.defaultSchemaJson;
        childSchema = this.prepareChildSchema(childSchema);

        for (let key in this.resolvers) {

            result[key] = this.resolvers[key](childSchema, thisSchema);
        }
        //merge the schema with parent schema
        return R.merge(childSchema, result);
    }
    toJSON(valueWhichIsField) {
        if (!this.isTypeCompatible(valueWhichIsField)) {
            return valueWhichIsField ? valueWhichIsField.get("value") : null;
        }
        let value = valueWhichIsField ? valueWhichIsField.get("value") : null;

        return value;
    }
    isTypeCompatible(field) {
        let error = field ? field.get("error"):null;
        if (error) {
            let errorType = getProp(error, "type");
            return errorType == ErrorTypes.typeMismatch ? false : true;
        }
        return true;
    }
}
export default BaseCore;