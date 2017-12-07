import R from "ramda";
import _ from 'lodash';
import Immutable from 'Immutable';
import BaseCore from '../basecore'
import {makeField,tryValidate, getProp,makeError,ErrorTypes} from "helpers/BuilderApi";

const getGeneralInferredHandler = function (genericType) {
    return class GeneralInferredHandler extends BaseCore {
        constructor() {
            super();
            this.type = this.coreType = genericType;
            this.defaultSchemaJson = {
                "type": this.type
            };
        }
        fromValue(value) {
            return makeField(value, this.defaultSchemaJson);
        }
        prepareChildSchema(childSchema) {
            return childSchema;
        }
        getRawValue(formattedValueAsString, field) {
            return this.toJSON(field);
        }
        getFormattedValue(field, formatOverride = null) {

            return this.toJSON(field);
        }
    };
};

export default getGeneralInferredHandler;