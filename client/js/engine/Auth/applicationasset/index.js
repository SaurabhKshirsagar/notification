import {DbContext} from "engine/db";
import R from 'ramda';
import Promise from "bluebird";
//import {mount, getInstance, ApplicationAssets} from "../ApplicationState";
import {set,get,Prop} from "appcontext";
let assets ={},
    appAsset = {
    "loadAsset": function (path) {
        let key = path.join();
        let result = assets[key];
        if(result){
            return Promise.resolve(result);
        }
        return DbContext
        .get(path)
        .then((value)=>{
            assets[key] = value;
            return value;
        });     
    }
}

module.exports = appAsset;