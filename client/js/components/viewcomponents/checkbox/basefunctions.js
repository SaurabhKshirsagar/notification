import { getField, getRawValue } from "appcontext";
import { getProp} from "helpers/BuilderApi";
let extractValue=function(e) {
        return e.target.checked;
}

module.exports= {
    extractValue
};