import componentPaths from "helpers/componentpaths";

export default function fetchComponentExports(type){
        // if type is all lowercase, then the component is
        // bound to be a React primitive,
        // resolve it with the same value as React 
        // will itself render it as a primitive element.
        if (type == type.toLowerCase()){
            return Promise.resolve(type);
        }
        const component = componentPaths[type];
        if (typeof component != "function"){
            throw `Component for type "${type}" is not a function.`;
        }
        return new Promise((resolve,reject)=>{
            require.ensure([],(require)=>{
                component()
                .then((file)=>resolve(file.default))
                .catch((e)=>reject(e))
            })
        })
    }