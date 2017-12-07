import React from 'react';
import GoogleMap from 'google-map-react';
import repeatableViewGenerater from "helpers/repeatableviewgenerater";
import AssetComponent from "components/assetcomponent";
import { get, getLens, Prop } from "appcontext";
import { exEvaluator } from "actions/exEvaluator.js";

const defaultCenter = { lat: 28.7040592, lng: 77.10249019999999 };

let renderMap = (thisReference, markers) => {
    let center = thisReference.state.props.center;
    return (
        <div style={thisReference.props.style}>
            <GoogleMap
                bootstrapURLKeys={{ key: 'AIzaSyDhySpndtoc6gGMqh8YocA_N36SPMtY8q0', language: 'en', libraries: ['places'] }}
                defaultCenter={defaultCenter}
                defaultZoom={10}
                center={center}
                ref="googleMap">
                {markers}
            </GoogleMap>
        </div>
    );
},
getComponentProps = (thisReference) => {
    return { center: defaultCenter };
},
renderMarkers = (thisReference, value, key, ds) => {
    let location = value.get("value").toJSON(),
        {children} = thisReference.props;
    return <AssetComponent asset={children[0]} lat={location.lat.value} lng={location.lng.value} />;
};

export default repeatableViewGenerater("Map", renderMap, renderMarkers, null, getComponentProps);