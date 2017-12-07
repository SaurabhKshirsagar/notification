import React from "react";

const swigy='{}',
      bracket = '[]',
      str = 'str';

let iconType = {
    "object":function(type){
        return <span className='tree-object-label'>{swigy}</span>
    },
    "string":function(type){
        return <span className='tree-string-label'>{str}</span>
    },   
    "array":function(type){
        return <span className='tree-array-label'>{bracket}</span>
    },
     "@string":function(type){
        return <span className='tree-string-label inferred'>{str}</span>
    },
     "@array":function(type){
        return <span className='tree-array-label inferred'>{bracket}</span>
    },
    "@complex":function(type){
        return <span className='tree-object-label inferred'>{swigy}</span>
    },
    "default":function(type){
        return <span className='tree-customType-label'>{swigy}</span>
    }
}
export default iconType;