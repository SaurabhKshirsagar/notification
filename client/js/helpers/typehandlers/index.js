import StringHandler from 'helpers/typehandlers/stringHandler';
import ComplexHandler from 'helpers/typehandlers/complexhandler';
import InferredBooleanHandler from 'helpers/typehandlers/inferredboolean';
import getGeneralInferredHandler from 'helpers/typehandlers/Generalinfferedhandler';
import InferredComplexHandler from 'helpers/typehandlers/inferredcomplex';
import InferredArrayHandler from "helpers/typehandlers/inferredarray"
import NumberHandler from 'helpers/typehandlers/numberhandler';
import ListHandler from 'helpers/typehandlers/listhandler';
import BooleanHandler from 'helpers/typehandlers/booleanhandler';
import DateHandler from 'helpers/typehandlers/datehandler';
import DictionaryHandler from 'helpers/typehandlers/dictionaryhandler';
let typeHandler={
    "string": new StringHandler(),
    "number" : new NumberHandler(),
    "complex":new ComplexHandler(),
    "@boolean":new (getGeneralInferredHandler("@boolean"))(),
    "@string":new (getGeneralInferredHandler("@string"))(),
    "@number":new (getGeneralInferredHandler("@number"))(),
    "@array":new InferredArrayHandler(),
    "@complex":new InferredComplexHandler(),
    "list":new ListHandler(),
    "boolean":new BooleanHandler(),
    "date":new DateHandler(),
    "dictionary":new DictionaryHandler()
}
export default typeHandler;