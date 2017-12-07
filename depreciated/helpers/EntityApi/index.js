import _ from 'lodash';
import R from 'ramda';
import DbContext from '../PersistenceLayer'
import errorMessage from "../Constants/ErrorMessages/EntityApi.js"
const ObjectID = require("bson-objectid");

const dbSchemaPath = ["Schemas", "EntitySchema"], dbEntityPath = ["EntityData"], revision = "_revision";
let fullPath = '',isSchema=false;
const EntityAPI = {
    "loadEntitySchema": function (paths) { 
        if(paths){
        fullPath = this._mergePath(dbSchemaPath, paths);
        return DbContext.get(fullPath);
        }else{
               return DbContext.get(dbSchemaPath);
        }
    },
    "updateEntitySchema": function (paths, entitySchema) {

        return this._getRevision(paths, revision,isSchema=true)
            .then((value)=>this._checkConflict(entitySchema._revision, value))
            .then(()=>{entitySchema._revision ++;return this._mergePath(dbSchemaPath, paths)})
            .then((fullPath)=>DbContext.update(fullPath, entitySchema));

    //     //return new Promise((resolve,reject)=>{
    //     this._getRevision(paths, revision,isSchema=true)
    //         .then((value) => {
    //               if(this._checkConflict(entitySchema._revision, value)){
    //                 fullPath = this._mergePath(dbSchemaPath, paths);
    //                 entitySchema._revision ++;
    //                 return   DbContext.update(fullPath, entitySchema);
    //                 // DbContext.update(fullPath, entitySchema).then(()=>{
    //                 //     resolve();
    //                 // })
    //               }
    //         });
    //   //  });
    },
    "createEntitySchema": function (paths, entitySchema) {
        let id = ObjectID().str;
        _.extend(entitySchema, { "_revision": 1, "Id": id });
        fullPath = this._mergePath(dbSchemaPath, paths);
        return DbContext.save(fullPath, entitySchema);
    },

    "deleteEntitySchema": function (paths) {
        fullPath = this._mergePath(dbSchemaPath, paths);
        return DbContext.delete(fullPath);
    },

    "loadEntity": function (paths, query = '') { 
        fullPath = this._mergePath(dbEntityPath, paths);
        return query ? DbContext.get(fullPath, query) : DbContext.get(fullPath);
    },
    "updateEntity": function (paths, entityData) { 
         return this._getRevision(paths, revision,isSchema=false)
            .then((value)=>this._checkConflict(entityData._revision, value))
            .then(()=>{entityData._revision ++;return this._mergePath(dbEntityPath, paths)})
            .then((fullPath)=>DbContext.update(fullPath, entityData));

        // this._getRevision(paths, revision,isSchema=false)
        //     .then((value) => {
        //         if(this._checkConflict(entityData._revision, value)){
        //              fullPath = this._mergePath(dbEntityPath, paths);
        //             entityData._revision ++;
        //             return DbContext.update(fullPath, entityData);
        //         }
        //     })
    },
    "createEntity": function (paths, entityData) {
        let id = ObjectID().str;
        _.extend(entityData, { "_revision": 1, "Id": id });
        fullPath = this._mergePath(dbEntityPath, paths, id);
        return DbContext.save(fullPath, entityData);
    },
    "deleteEntity": function (paths) {
        fullPath = this._mergePath(dbEntityPath, paths);
        return DbContext.delete(fullPath);
    },
    "_mergePath": function (constPath, variablePath, id) { 
        return id ? _.concat(constPath, variablePath, id) : _.concat(constPath, variablePath);
    },
    "_getRevision": function (paths, revision, isSchema) { 
        return new Promise((resolve, reject) => {
            fullPath = this._mergePath(paths, revision)
            let revisionPromise;
            if(isSchema){ revisionPromise=   this.loadEntitySchema(fullPath)}
            else  {revisionPromise=this.loadEntity(fullPath)}
            revisionPromise.then((revisionNumber) =>{
                revisionNumber ? resolve(revisionNumber) : reject(errorMessage.VersionNotFound)
            }); 
        })
    },
    "_checkConflict": function (initialVersion, currentVersion) {
        return new Promise((resolve, reject) => {
            if (initialVersion === currentVersion) {
                resolve(true);
            } else {
                reject("version mismatch");
            }
        });
    },
};

module.exports = EntityAPI