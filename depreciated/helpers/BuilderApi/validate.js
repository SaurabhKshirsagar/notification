import _ from 'lodash';
import Promise from 'bluebird';
import {DbContext} from 'engine/db';
import builder from '../schemaBuilders/entityBuilder';
import immutable from 'immutable';


let validateString =async function(entityName,json,attr){
    let {Type,Of,Name,Required}=attr;
        if(json.hasOwnProperty(Name)){
        if(typeof(json[Name])!='string')
            return Promise.reject(`${entityName}'s ${Name} schema type is ${Type} it must refered as String`);
    }else if(Required)
        return Promise.reject(`${entityName}'s ${Name} is required Attribute`);
    else 
        return Promise.resolve();
}

let validateNumber=async function(entityName,json,attr){
    let {Type,Of,Name,Required}=attr;
        if(json.hasOwnProperty(Name)){
        if(typeof(json[Name])!='number')
            return Promise.reject(`${entityName}'s ${Name} schema type is ${Type} it must refered as Number`);
    }else if(Required)
        return Promise.reject(`${entityName}'s ${Name} is required Attribute`);
    else 
        return Promise.resolve();
}
let validateChoice = async function(entityName,json,attr){
    if(json.hasOwnProperty(Name)){
        if(!Array.isArray(json[Name]))
            return Promise.reject(`${entityName}'s ${Name} schema type is ${Type} it must refered as Array`);
    }else if(Required)
        return Promise.reject(`${entityName}'s ${Name} is required Attribute`);
    else 
        return Promise.resolve();
}

let validateList=async function(entityName,json,attr){
    let {Type,Of,Name,Required}=attr;
        if(json.hasOwnProperty(Name)){
        if(!Array.isArray(json[Name]))
            return Promise.reject(`${entityName}'s ${Name} schema type is ${Type} it must refered as Array`);
        else{
            DbContext.get(['schemas','EntitySchemas',Of]).then((schema)=>{
                if(json[Name].length){
                    return Promise.all(json[Name].map((element)=>{
                            fromModel(schema,element);
                    }))
                }
            });  
        }
    }else if(Required)
        return Promise.reject(`${entityName}'s ${Name} is required Attribute`);

}

let validateCollection=async function(entityName,json,attr){
    let {Type,Of,Name,Required}=attr;
        if(json.hasOwnProperty(Name)){
        if(!Array.isArray(json[Name]))
            return Promise.reject(`${entityName}'s ${Name} schema type is ${Type} it must refered as Array`);
    }else if(Required)
        return Promise.reject(`${entityName}'s ${Name} is required Attribute`);   
}

module.exports={
    "validateString":validateString,
    "validateNumber":validateNumber,
    "validateChoice":validateChoice,
    "validateList":validateList,
    "validateCollection":validateCollection
};