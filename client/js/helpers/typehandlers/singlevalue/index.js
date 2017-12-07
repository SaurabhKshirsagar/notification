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


let SingleValue = function (wrapped) {
    return class Single extends wrapped {
        constructor() {
            super();
        }
        toJSON(valueWhichIsField) {
            if (!this.isTypeCompatible(valueWhichIsField)) {
               return valueWhichIsField ? valueWhichIsField.toJSON() : null;
            }
            return valueWhichIsField ?
                (valueWhichIsField.get("value").toJSON ? valueWhichIsField.get("value").toJSON() : valueWhichIsField.get("value")) :
                null;
        }
    }
}

export default SingleValue;