import typeHandlers from "helpers/typehandlers";
import StringHandler from "helpers/typehandlers/stringhandler";
import {getEntitySchema} from "engine/Db/contexts/schemas";
import {getProp,inferSchema} from "helpers/BuilderApi";
//createtypeHandler

let getTypeHandler = function(type){
    if (!type){
        throw `Missing "type" parameter in call to getTypeHandler`;
    }
    // first try to find handler of this schema's type.
    // if its not found: 
    // 1. invoke getEntitySchema of this schema type
    // to find the parent type which this type is based on.
    // 2. recursively call getTypeHandler on the parent type.
    // 3. Derive handler from parent handler and store it with
    // this type's name.
    // return handler.
    let handler = typeHandlers[type],
    schema = getEntitySchema(type);
    if (handler){
        return handler;
    }
    let parentType = getProp(schema, "type");
    handler = getTypeHandler(parentType);

    let derived = class Derived extends handler.constructor {
          constructor() {
              super();
              let defaultSchema = super.resolveSchema(schema);
              this.defaultSchemaJson = defaultSchema;
              this.type = type; 
          }
    };

     typeHandlers[type] = new derived();
     
     return typeHandlers[type];
}
export {getTypeHandler} ;
