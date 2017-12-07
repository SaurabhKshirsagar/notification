import firebase from 'firebase';
import Auth from '../../actions/auth'
import Promise from 'bluebird';
import {p, set, getLens} from "appcontext";

let auth = {
    "setup": () => {
        return new Promise((resolve, reject) => {
            firebase.auth().onAuthStateChanged((user) => {
                let loadinglens = getLens(p("ApplicationContext.AuthState.loading"));
                set(loadinglens, true);
                Auth.updateAuthState(user);
                return resolve(true);
            });
        });
    }
}

module.exports = { auth };