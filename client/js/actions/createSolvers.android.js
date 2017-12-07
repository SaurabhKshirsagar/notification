
import Promise from 'bluebird';
import R from "ramda";
import actionsPath from "actions/actionsPath";

async function getFunction(resolvedCallee){
        const actions = actionsPath[resolvedCallee];
        return new Promise((resolve,reject)=>{
                    return resolve(actions)
                })
};

//Evaluate function depending upon 
async function createSolvers(expressionJson,contexts, resolvePropToValue) {
    let solvers = {
        "Literal": async function (node) {
            return node.value;
        },
        "CallExpression": async function (node) {
            let {callee} = node;
            let nodeargs = node["arguments"];
            let resolvedArgs = await Promise.all(nodeargs.map(async (arg)=> await solvers[arg.type](arg)));   
            let resolvedCallee =  await solvers[callee.type](callee);
            
            if(typeof(resolvedCallee) != "function"){
                  let actionCategory = await getFunction("globals");
                  resolvedCallee = actionCategory[resolvedCallee];
            }
            resolvedArgs.push(contexts);
            let result = await resolvedCallee.apply(null,resolvedArgs);
            return result;
        },
        "Identifier": async function (node) {
            return node.name;
        },
        "MemberExpression": async function (node) {
            let {object, property} = node;
            let resolvedObject = await solvers[object.type](object),
                resolvedProperty = await solvers[property.type](property);
                // fetch actionCategory
                let actionCategory = await getFunction(resolvedObject);
                return actionCategory[resolvedProperty];
            
        },
        "LogicalExpression":async function (node) {
            let {operator,left,right} = node;
            let leftValue = await solvers[left.type](left),
                rightValue = await solvers[right.type](right),
                result =await resolveBiLogicalExpressions(operator,leftValue,rightValue,contexts, resolvePropToValue);
            return result;
        },
        "BinaryExpression":async function (node) {
            let {operator,left,right} = node;
            let leftValue = await solvers[left.type](left),
                rightValue = await solvers[right.type](right),
                result =await resolveBiLogicalExpressions(operator,leftValue,rightValue,contexts, resolvePropToValue);
            return result;
        },
        "UnaryExpression":async function (node) {
            let {operator,argument} = node;
            if(argument){
                let argumentValue = await solvers[argument.type](argument),
                    result =await resolveUnaryExpression(operator,argumentValue,contexts, resolvePropToValue);
                return result;
            }
            else
            throw 'Oprator without Argument please check actions expression';
        }
    };

    let solver = solvers[expressionJson.type];
    if (!solver) {
        throw `The type "${expressionJson.type}" doesn't have a solver, expression is "${JSON.stringify(expressionJson)}".`;
    }

    let result = await solver(expressionJson);
    return result;
};

async function resolveBiLogicalExpressions(operator,leftValue,rightValue,contexts, resolvePropToValue)
{
    let leftVal=resolvePropToValue(leftValue,contexts);
    let rightVal=resolvePropToValue(rightValue,contexts);
    let result=null;
    switch(operator)
    {
        case '||':  result= (leftVal || rightVal);  break;
        case '&&':  result= (leftVal && rightVal);  break;
        case '|':   result= (leftVal | rightVal);   break;
        case '^':   result= (leftVal ^ rightVal);   break;
        case '&':   result= (leftVal & rightVal);   break;
        case '==':  result= (leftVal == rightVal);  break;
        case '!=':  result= (leftVal != rightVal);  break;
        case '===': result= (leftVal === rightVal); break;
        case '!==': result= (leftVal !== rightVal); break;
        case '<':   result= (leftVal < rightVal);   break;
        case '>':   result= (leftVal > rightVal);   break;
        case '<=':  result= (leftVal <= rightVal);  break;
        case '>=':  result= (leftVal >= rightVal);  break;
        case '<<':  result= (leftVal >> rightVal);  break;
        case '>>>': result= (leftVal >>> rightVal); break;
        case '+':   result= (leftVal + rightVal);   break;
        case '-':   result= (leftVal - rightVal);   break;
        case '*':   result= (leftVal * rightVal);   break;
        case '/':   result= (leftVal / rightVal);   break;
        case '%':   result= (leftVal % rightVal);    break;
    }
    return result;
};

async function resolveUnaryExpression(operator,argumentValue,contexts, resolvePropToValue)
{
    let argumentVal=resolvePropToValue(argumentValue,contexts);
    let result=null;
    switch(operator)
    {
        case '-':  result= - argumentVal;  break;
        case '!':  result= ! argumentVal;  break;
        case '~':   result= ~ argumentVal;   break;
        case '+':   result= + argumentVal;   break;
    }
    return result;
}




export default createSolvers;
