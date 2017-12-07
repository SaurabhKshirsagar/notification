import React from 'react';
import ReactDOM from 'react-dom';
import Promise from 'bluebird';
import R from 'ramda';
import { MemoryRouter as Router } from 'react-router';
import {ReactHistory} from "components/reacthistory"
import {getLens, Prop, set} from "appcontext";
import AssetComponent from 'components/assetcomponent';
import asPromise from "helpers/aspromise";

import {AppRegistry, View, Text} from 'react-native';


let app = {
    "setup": R.curry(asPromise((setAppView, prevResult) => {
        const portalAsset =
            {
                "props": {
                    "ref": "Views/PortalAsset",
                    "path": {
                        "pattern": "/"
                    }
                },
                "type": "View"
            };

        let Root = (
            <Router>
             <ReactHistory>
                <View style={{ flex: 1 }}>
                    <AssetComponent asset={portalAsset} uid={0} context={getLens(new Prop("ApplicationContext")) } />
                </View>
            </ReactHistory>
            </Router>
        );
        setAppView(Root);
    }))
}
module.exports = app;
