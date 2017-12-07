
import Promise from 'bluebird';
import R from "ramda";

import {gethistory} from "components/reacthistory";

let browseTo=R.curry(async function(path,contextObj){
    let appLens = getLens(new Prop("ApplicationContext"));
     let navTo=resolvePropToValue(path,contextObj);
     let history=gethistory();
     history.push(`${navTo}`);
});

let navigateTo= function(path){
     let history=gethistory();
     history.push(`${path}`);
}

let historyPop=function(){
     debugger;
     let history=gethistory();
     history.goBack();
};
module.exports= {
    "browseTo": browseTo,
    "navigateTo":navigateTo,
    "historyPop":historyPop
};
