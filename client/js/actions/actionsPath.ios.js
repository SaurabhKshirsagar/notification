import promise from 'bluebird';
import assets from 'actions/assets';
import location from 'actions/location';
import globals from 'actions/globals';
import navigation from 'actions/navigation';
import auth from 'actions/auth';

let actionsPath = {
    assets,
    location,
    globals,
    navigation,
    auth
};
export default actionsPath;

