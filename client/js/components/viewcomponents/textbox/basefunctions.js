import { getField, getRawValue } from "appcontext";
import { getProp} from "helpers/BuilderApi";
let extractValue=function(e) {
        let field = getField(this.state.propLenses.dataSource),
            schema = field.get("schema"),
            format = this.state.props.format || getProp(schema, "format"),
            formattedValue = e.target.value;
        let rawValue = getRawValue(formattedValue, field, format);
        return rawValue;
}

module.exports= {
    extractValue
};