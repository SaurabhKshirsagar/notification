import {DbContext} from 'engine/db';
import Promise from 'bluebird';
import R from "ramda";
import _ from "lodash";
import {resolvePropToValue,getField,getLens} from "appcontext";
import {getTypeHandler} from "helpers/createhandler";
import ObjectID from "bson-objectid";

let loadEntity=R.curry(async function(entityNamePath,key,contextObj){
    let entityName=resolvePropToValue(entityNamePath,contextObj);
    let path=[entityName,`${key}`];
    return await DbContext.get(['entities'].concat(path));
});
   
let getModules = R.curry(async function(contextObj){
    let data= await DbContext.get(['entities','modules']);
    return _.values(data);
});

let getModule = R.curry(async function(pathAppID,contextObj){
    let appID=resolvePropToValue(pathAppID,contextObj);
    return await DbContext.get(['entities','modules'].concat(appID));
});

let savEntity = R.curry(async function(collectionName, entityObject,contextObj){
    collectionName = resolvePropToValue(collectionName,contextObj);
    let id = ObjectID().str,
    field = getField(getLens(entityObject, contextObj));   
    let type = field.getIn(["schema","type"]);
    let handler = getTypeHandler(type);
    let value = handler.toJSON(field);
    field = handler.fromValue(value);
    if(field.getIn(["error"])){
        alert(`${collectionName} has error please check and try again.`);
        return
    }
    let entity = await DbContext.save(['entities',collectionName,id],value);
    alert(`${collectionName} saved succsessfully.`);
});

let loadcollection = R.curry(async function(collectionName,contextObj){
    let entityName=resolvePropToValue(collectionName,contextObj);
    let path=[entityName];
    return await DbContext.get(['entities'].concat(path));
});

export default {
    "loadEntity": loadEntity,
    "getModules":getModules,
    "getModule":getModule,
    "savEntity":savEntity,
    "loadcollection":loadcollection
};
