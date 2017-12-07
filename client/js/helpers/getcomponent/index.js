import uiComponentFactory from "engine/uicomponentfactory";
let getComponent = (props)=>{
	let {asset:{type}} = props;
	return uiComponentFactory.getComponent(type);
};
export default getComponent;
