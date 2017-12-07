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

let MultiValue = function (wrapped) {
    return class Multi extends wrapped {
        constructor() {
           super();
        }
        toJSON(valueWhichIsField) {
            if (!this.isTypeCompatible(valueWhichIsField)) {
                return valueWhichIsField ? valueWhichIsField.get("value").toJSON() : null;
            }
            let result = {};
            if (valueWhichIsField) {
                let value = valueWhichIsField.get("value"),
                    attributesKeys = Object.keys(value.toJSON());
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
}

export default MultiValue;