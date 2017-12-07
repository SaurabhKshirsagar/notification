
import jsep from 'jsep';
import Promise from 'bluebird';
import R from "ramda";
import createSolvers from "actions/createSolvers";
import {set,Prop,getLens,getField,notify, resolvePropToValue} from "appcontext"; 

function onProcessActions(actions,context) { 
        let res=actions.reduce((prev, next) => {
            let {type, value, target,precondition} = next;
            return prev.then(() => {
                    if(precondition){
                        exEvaluator(precondition.value,context).then((result) =>{
                            if(result)
                            return callExEvalWrapper(value,target,context);
                        })
                        .catch((err) => {
                                console.log("action not executed");
                                throw err;
                        })
                    }
                    else 
                    return callExEvalWrapper(value,target,context) 
            });
        }, Promise.resolve()).catch((err)=>console.log(err));
        return res;
};
async function exEvaluator(expression,contexts, propResolver = resolvePropToValue) {
        let actionLibArry=[];
        let expressionJson=jsep(""+expression);
        let result = await createSolvers(expressionJson,contexts, propResolver);
       
        return result;
};
function callExEvalWrapper(value,target,context){
        return exEvaluator(value,context).then((actionresult) =>{
                if(target){
                    return exEvaluator(target,context)
                    .then((path)=>{
                            //if value then merge or set 
                            if(Prop.isProp(path)){
                                let pathLens = getLens(path,context);
                                let field = getField(pathLens);
                                let schema = field.get("schema");
                                set(pathLens,actionresult);
                            }
                    })
                }
            })
            .catch((err) => {
                    console.log("action not executed");
                    throw err;
            })
};

module.exports = {
    "exEvaluator": exEvaluator,
    "onProcessActions": onProcessActions
};