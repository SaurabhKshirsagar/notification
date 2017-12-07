import _ from 'lodash';
import ReactNativePropRegistry from 'react-native/Libraries/Renderer/src/renderers/native/ReactNativePropRegistry';

module.exports = function(incomingProps, defaultProps) {

    var computedProps = {};

    incomingProps = _.clone(incomingProps);
    delete incomingProps.children;

    var incomingPropsStyle = incomingProps.style;
    delete incomingProps.style;
    if(incomingProps) {
      _.assign(computedProps, defaultProps, incomingProps);
    } else
        computedProps = defaultProps;
    if(incomingPropsStyle) {

        var computedPropsStyle = {};
        computedProps.style = {};
        if (Array.isArray(incomingPropsStyle)) {
            _.forEach(incomingPropsStyle, (style)=>{
                if(typeof style == 'number') {
                    _.merge(computedPropsStyle, ReactNativePropRegistry.getByID(style));
                } else {
                    _.merge(computedPropsStyle, style);
                }
            })

        }
        else {
            if(typeof incomingPropsStyle == 'number') {
                computedPropsStyle = ReactNativePropRegistry.getByID(incomingPropsStyle);
            } else {
                computedPropsStyle = incomingPropsStyle;
            }
        }

        _.merge(computedProps.style, defaultProps.style, computedPropsStyle);


    }
    return computedProps;
}