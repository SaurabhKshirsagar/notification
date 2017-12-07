import errorMessages from "helpers/typehandlers/errorMessages";

let   errorMessageProviders = {
         "type": () => {
            return errorMessages.type;
        },
        "required": () => {
            return errorMessages.required;
        },
        "minLength": (schema) => {
            let {minLength} = schema;
            return `This value cannot be less than {minLength} characters.`;
        },
        "maxLength": (schema) => {
            let {maxLength} = schema;
            return `This value cannot be more than {maxLength} characters.`;
        },
         "min": (schema) => {
            let {min} = schema;
            return 'This value cannot be less than {min}.';
        },
        "max": (schema) => {
            let {max} = schema;
            //return `This value cannot be more than ${max}.`;
            return 'This value cannot be more than {max}.';
        },
        "patternValidation": (schema) => {
            return errorMessages.patternValidation;
        },
         "domainError":(schema)=>{
            return errorMessages.domainError;
        }
    };
export default errorMessageProviders;