import firebase from 'firebase';
import {p, resolvePropToValue, set, getLens, get} from "appcontext"; 
import axios from 'axios';
import {loginApi,userInfoApi,guestUser}  from '../settings'

const loadStateLens = getLens(p("ApplicationContext.AuthState.loading")),
    userLens = getLens(p("ApplicationContext.AuthState.user")),
    alertsLens = getLens(p("ApplicationContext.Alerts"));

let updateAuthState = async function (userInfo) {
    if (userInfo){
        set(loadStateLens, false);
        let token=localStorage.getItem(userInfo.uid)
        if(token){
            let  userInfo = await getUserInfo(token);
            //userInfo=_.omit(userInfo, ['sub','given_name','family_name','http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider','http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
            set(userLens, userInfo);
        }
    }
    else {
        set(loadStateLens, false);
        set(userLens, guestUser);
    }
}

let signIn = async function (username, password, contextObj) {
    set(loadStateLens, true);
    let uName = resolvePropToValue(username, contextObj);
    let pWord = resolvePropToValue(password, contextObj);
    try {
        let {data: {JWTtoken,token}} = await axios({
            url: loginApi,
            method: 'POST',
            contentType: "application/json",
            data: { "username": uName, "password": pWord },
            json: true
        });
        await signInWithCustomToken(JWTtoken, token);
        return true;
    } catch (error) {
        let msg="Type your username and password again to make sure that they are correct.";
         set(alertsLens, msg);
        console.log(error);
    }
}

let signOut = async function (contextObj) {
    try{
        await firebase.auth().signOut();
        return true;
    }catch(e){ 
        alert(e); 
        return false;
    }
}

let getUserInfo = async function (accessToken) {
    try {
       let { data: userInfo} = await axios({
            url: userInfoApi,
            headers: {
                authorization: `Bearer ${accessToken}`
            },
            rejectUnauthorized: false
        });
        userInfo=_.omit(userInfo, ['sub','given_name','family_name','http://schemas.microsoft.com/accesscontrolservice/2010/07/claims/identityprovider','http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
        return  userInfo;
    } catch (error) {
         
         set(alertsLens, error);
    }
}

let signInWithCustomToken = async function (JWTtoken, token) {
    try {
        await firebase.auth().signInWithCustomToken(JWTtoken);
        let userInfo = await getUserInfo(token);
        localStorage.setItem([userInfo.id], token)
          
        set(userLens, userInfo);
        return true;
    } catch (error) {
        console.log(error)

        set(userLens, guestUser);
    
    }
}

let isUserAthenticated = async function (context) {
    let userInfo=get(userLens) ? get(userLens).toJSON() : {};
    if(userInfo.hasOwnProperty("guest"))
        return false;
    return true; 
}

export default {
    "updateAuthState": updateAuthState,
    "signIn": signIn,
    "signOut": signOut,
    "isUserAthenticated":isUserAthenticated
};