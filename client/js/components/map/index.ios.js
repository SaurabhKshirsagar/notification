import React from 'react';

import repeatableViewGenerater from "helpers/repeatableviewgenerater";
import AssetComponent from "components/assetcomponent";
import { get, getLens, Prop } from "appcontext";
import { exEvaluator } from "actions/exEvaluator.js";
import MapView from 'react-native-maps';
const defaultCenter = {
    latitude: 28.7040592,
    longitude: 77.10249019999999
   
};

let renderMap = (thisReference, markers) => {
    let center = markers[0] ? markers[0].props.coordinate : thisReference.state.props.center;
       center["latitudeDelta"]= 0.5722;
      center["longitudeDelta"]= 0.3721;
    return (
        <MapView
            style={thisReference.props.style}
            region={center}>{markers.map((marker)=><MapView.Marker coordinate={marker.props.coordinate}>
            {marker}
            </MapView.Marker>  
            )}</MapView>
    );
},
    getComponentProps = (thisReference) => {
        return { center: defaultCenter };
    },
    renderMarkers = (thisReference, value, key, ds) => {
        let location = value,
            {children} = thisReference.props,
            latlong = {
                longitude: location.lng,
                latitude: location.lat
            };
        return <AssetComponent asset={children[0]} coordinate={latlong} context={thisReference.props.context} title={location.location_type}/>
          
    };

export default repeatableViewGenerater("Map", renderMap, renderMarkers, null, getComponentProps);