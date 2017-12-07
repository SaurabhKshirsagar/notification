const containerComponentElements = {"list" : true, "map" : true,"dropdowncontrol":true};

let isContainerComponent = (type) => {
    return containerComponentElements[type.toLowerCase()] != null;
}
export default isContainerComponent;