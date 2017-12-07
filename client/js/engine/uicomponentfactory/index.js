import React from 'react';
import ReactDOM from 'react-dom';
import fetchComponentExports from "helpers/fetchcomponentexports";
//import PromiseComponent from "../../components/PromiseComponent/PromiseComponent";

let UIComponentFactory={
    // createComponent(uiState){
    //     return <PromiseComponent uiState={uiState}/>;
    // },
    // createUIState(asset,context){
    //    return fetchComponentExports(asset.type)
    //     .then(({default:{createUIState}})=>createUIState(asset,context));
    // },
    getComponent(type){
        return fetchComponentExports(type);
    }
}

export default UIComponentFactory;