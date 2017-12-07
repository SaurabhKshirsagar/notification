import R from "ramda";
import _ from 'lodash';

let resolver = R.curry((prop, fn, left, right) => fn(left[prop], right[prop])),
resolveRequired = resolver("required", R.or),
resolveMin = resolver("min", Math.max),
resolveMax = resolver("max", Math.min),
resolveMinLength = resolver("minLength", Math.max),
resolveMaxLength = resolver("maxLength", Math.min),
resolveDefaultValue = resolver("defaultValue", R.or),
resolveFormat = resolver("format", R.or),
resolveAllowsNull = resolver("allowsNull", R.or),
resolvePatternValidation = resolver("patternValidation", _.concat);

module.exports = {
    resolveRequired,
    resolveMin,
    resolveMax,
    resolveMinLength,
    resolveMaxLength,
    resolveDefaultValue,
    resolveAllowsNull,
    resolveFormat,
    resolvePatternValidation
};