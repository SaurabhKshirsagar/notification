import {DbContext} from 'engine/db';
import Promise from 'bluebird';
import R from "ramda";
import {p,getLens,rp} from "appcontext";

let P=R.curry(function(path,context){ 
    return p(path);    
});

let RP=R.curry(function(path,context){ 
    return rp(path);    
});

export default {
    "p": P,
    "rp":RP
};
