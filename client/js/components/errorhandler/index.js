import _ from "lodash";

export default function tryCatch(React, ErrorHandler) {
    if (!React || !React.Component) {
        throw new Error('arguments[0] fordoes not look like React.');
    }
    if (typeof ErrorHandler !== 'function') {
        throw new Error('arguments[1] for does not look like a function.');
    }

    return function wrapWithTryCatch(Component) {
        const originalRender = Component.prototype.render;

        Component.prototype.render = function tryRender() {
            try {
                let renderComp = originalRender.apply(this, arguments);
                if (_.isObject(renderComp)
                    && !renderComp.hasOwnProperty("type")
                    && !renderComp.hasOwnProperty('$$typeof')
                    )
                    throw "Component return an Object"
                // else if (!(renderComp.type.prototype instanceof React.Component))
                //     throw "Not a Component"
                else if (_.isArray(renderComp))
                    throw "Component return an array"
                return renderComp;
            } catch (err) {
                if (ErrorHandler.prototype && ErrorHandler.prototype.render) {
                    let {style}=this.props;
                    _.set(style,["border"],"1px solid red");
                    let props= {style:style,error:err};
                    return React.createElement(ErrorHandler, props);
                }

                return ErrorHandler(err);
            }
        };
        return Component;
    };
}