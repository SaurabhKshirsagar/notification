import {DbContext} from 'engine/db';
import Promise from 'bluebird';
import R from "ramda";
import _ from 'lodash';
import {resolvePropToValue} from "appcontext";
import axiosCall from 'helpers/axioscall';
import loadGoogleMapsAPI from 'load-google-maps-api';

const gapiOptions = {
    key : "AIzaSyBDMRO4v8YPFwPhLlQWsCOTTnlRyTOzmIA",
    libraries : ["places"]
};

let getAddressLatLong = function(gapi, address){
    return new Promise((res, rej) => {
        let geocoder = new gapi.Geocoder();
        geocoder.geocode({address}, (results, status)=>{
            if (status != "OK"){
                return rej(`Error in Google Geocode API Search: ${status}`);
            }

            return res(results);
        });
    });
};

let getNearbyPlaces = function(gapi, address, {lat, lng}){
    let map = new gapi.Map(document.createElement("div"));
    let placesSvc = new gapi.places.PlacesService(map);
    let request = {
            name : address,
            location : new gapi.LatLng(lat, lng),
            //radius : '50000',
            rankBy: gapi.places.RankBy.DISTANCE,
            query:address
    };
    let result =new Promise((res,rej)=>{
        placesSvc.textSearch(request,(results, status)=>{
            if (status != gapi.places.PlacesServiceStatus.OK){
                return rej(`Error in Google Places API Search: ${status}`);
            }

            return res(_.take(results.map(place => ({
                lat:place.geometry.location.lat(), 
                lng:place.geometry.location.lng(), 
                address:place.name, 
                locationType:place.types, 
                icon:place.icon
            })), 30));
        });
    });
        // let result = new Promise((res, rej) => {
        //     placesSvc.nearbySearch(request, (results, status)=>{
        //         if (status != gapi.places.PlacesServiceStatus.OK){
        //             return rej(`Error in Google Places API Search: ${status}`);
        //         }

        //         return res(results.map(place => ({
        //             lat:place.geometry.location.lat(), 
        //             lng:place.geometry.location.lng(), 
        //             address:place.name, 
        //             locationType:place.types, 
        //             icon:place.icon
        //         })));
        //     });
        // });

        return result;
}


let geoCode=R.curry(async function(addressText,contextObj){
    	let address=resolvePropToValue(addressText,contextObj);
        let gapi = window.google.maps || await loadGoogleMapsAPI(gapiOptions);
        return getAddressLatLong(gapi, address)
        .then(results => {
            let returnResult = results.map((address)=>{return {lat:address.geometry.location.lat(),lng:address.geometry.location.lng(),location_type:address.geometry.location_type,address:address.formatted_address}});
            let [{lat, lng}] = returnResult;
            return getNearbyPlaces(gapi, address, {lat, lng});
        });
    })


let getItem=R.curry(async function(itemPath,contextObj){
     let item = resolvePropToValue(username, contextObj);
     return item;
})

export default {
    "geoCode": geoCode
};
