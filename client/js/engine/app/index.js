import React from 'react';
import ReactDOM from 'react-dom';
import Promise from 'bluebird';
import R from 'ramda';
import {BrowserRouter} from 'react-router';
import DevTools from 'mobx-react-devtools';

import Bootstrap from 'styles/themes/paper/bootstrap.css';
import {getLens, Prop, set} from "appcontext";
import AssetComponent from 'components/assetcomponent';
import asPromise from "helpers/aspromise";
import {ReactHistory} from "components/reacthistory"
require("../../../styles/styles.css");
import PortalAsset from "components/portalasset"


let app = {
    "setup": asPromise(() => {
        const portalAsset =
            {
                "props":{
                    "ref":"Views/PortalAsset",
                    "path":{
                        "pattern":"/"
                    }
                },
                "type":"View"
            };
        
        let Root =  (
            <BrowserRouter>
                <ReactHistory>
                    <div style={{height:"100%",width:"100%"/*,overflow:"hidden"*/}}>
                       <PortalAsset  path={{"pattern":"/"}} hasOwnScope={true} uid={0} context={getLens(new Prop("ApplicationContext"))}/>
                       <DevTools/>
                    </div>
               </ReactHistory>
            </BrowserRouter>);
       ReactDOM.render(Root, document.getElementById("app"));
    })   
}
module.exports = app;