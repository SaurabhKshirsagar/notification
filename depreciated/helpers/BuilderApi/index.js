import _ from 'lodash';
import Promise from 'bluebird';
import {DbContext} from 'engine/db';
import builder from '../schemaBuilders/entityBuilder';
import immutable from 'immutable';
let entityBuilder = builder();

let createDefault=(entitySchema)=> {
    let attributeObject={},
    defaultEntity = entityBuilder.fromModel(entitySchema); 
    defaultEntity.Attributes.forEach((attr)=>{
        switch(attr.Type){
            case "String":
            case "Memo":
            case "Number":
            case "DateTime":
                _.set(attributeObject,[attr.Name],"");
            break;
            case "Object":
            case "Collection":
                _.set(attributeObject,[attr.Name],{});
            break;
            case "List":
            case "Choice":
               _.set(attributeObject,[attr.Name],[]);
            break;
        }
    })
    return immutable.fromJS(attributeObject);
}

async function fromModel(entitySchema,json){
    let attributeObject={};
    let entityName=entitySchema.Name;
    let Attributes=entitySchema.Attributes;
    let attrVal=await Promise.all(await Attributes.map(async (attr)=>{
        let {Type}=attr;
        let res = await jsonMaker[Type](entityName,json,attr);
         _.set(attributeObject,[attr.Name],res);  
         return Promise.resolve();
    }));
    return attributeObject;
}

let jsonMaker={
    "String":async function(entityName,json,attr){
        let {Type,Of,Name,Required}=attr;
        let isValid = validate.String(entityName,json,attr);
        if(isValid==true){
             return json[Name];
        }else
             throw isValid;
    },
    "DateTime":async function(entityName,json,attr){
        let {Type,Of,Name,Required}=attr;
        let isValid =  validate.String(entityName,json,attr);
        if(isValid==true){
             return json[Name];
        }else
         throw isValid;   
    },
    "Memo":async function(entityName,json,attr){
        let {Type,Of,Name,Required}=attr;
        let isValid = await validate.String(entityName,json,attr);
        if(isValid==true){
             return json[Name];
        }else
         throw isValid;     
    },
    "Number":async function(entityName,json,attr){
        let {Type,Of,Name,Required}=attr;
        let isValid = await validate.Number(entityName,json,attr);
        if(isValid==true){
             return json[Name];
        }else
         throw isValid;      
    },
    "Choice":async function(entityName,json,attr){
        let {Type,Of,Name,Required}=attr;
        let isValid = validate.List(entityName,json,attr);
        if(isValid==true){
            return json[Name];
        }else
         throw isValid;       
    },
    "List":async function(entityName,json,attr){
        let {Type,Of,Name,Required}=attr;
        let isValid = validate.List(entityName,json,attr);
        if(isValid==true){
             let schema=await DbContext.get(['schemas','EntitySchemas',Of]);
             let list=await Promise.all(await json[Name].map(async(element)=>{
                return  await fromModel(schema,element);
             }));
             return list;
        }else
         throw isValid;  
    },
    "Collection":async function(entityName,json,attr){
        //let isValid = await validate.Collection(entityName,json,attr);     
    }
}

let validate={
    "String": function(entityName,json,attr){
        let {Type,Of,Name,Required}=attr;
         if(json.hasOwnProperty(Name)){
            if(typeof(json[Name])!='string'){
                return `${entityName}'s ${Name} schema type is ${Type} it must refered as String`;
            }
        }else if(Required)
            return `${entityName}'s ${Name} is required Attribute`;   
        return true;
    },
    "Number": function(entityName,json,attr){
        let {Type,Of,Name,Required}=attr;
         if(json.hasOwnProperty(Name)){
            if(typeof(json[Name])!='number')
                return `${entityName}'s ${Name} schema type is ${Type} it must refered as Number`;
        }else if(Required)
            return `${entityName}'s ${Name} is required Attribute`;
        return true;
    },
    "Choice": function(entityName,json,attr){
        if(json.hasOwnProperty(Name)){
            if(!Array.isArray(json[Name]))
                return `${entityName}'s ${Name} schema type is ${Type} it must refered as Array`;
        }else if(Required)
            return `${entityName}'s ${Name} is required Attribute`;
        return true;
    },
    "List": function(entityName,json,attr){
        let {Type,Of,Name,Required}=attr;
         if(json.hasOwnProperty(Name)){
            if(!Array.isArray(json[Name]))
                return `${entityName}'s ${Name} schema type is ${Type} it must refered as Array`;
           else 
                return true;
        }else if(Required)
            return `${entityName}'s ${Name} is required Attribute`;
    },
    "Collection": function(entityName,json,attr){
        let {Type,Of,Name,Required}=attr;
         if(json.hasOwnProperty(Name)){
            if(!Array.isArray(json[Name]))
                return `${entityName}'s ${Name} schema type is ${Type} it must refered as Array`;
            else
                return true;
        }else if(Required)
            return `${entityName}'s ${Name} is required Attribute`;   
    },
}

module.exports = {
    createDefault,
    fromModel
}
