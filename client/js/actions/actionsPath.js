import Promise from 'bluebird';

let actionsPath = {
    "assets":require("promise?bluebird,actions!./assets.js"),
    "location":require("promise?bluebird,actions!./location.js"),
    "globals":require("promise?bluebird,actions!./globals.js"),
    "navigation":require("promise?bluebird,actions!./navigation.js"),
    "auth":require("promise?bluebird,actions!./auth.js")
};

export default actionsPath;

