//let lazyRequire=(componentPath)=>()=>require(`promise?bluebird!${componentPath}`)
import promise from 'bluebird';
import Textbox from 'components/viewcomponents/textbox';
import MapComp from 'components/map';
import Label from 'components/label';
import View from 'components/view';
import Button from "components/viewcomponents/button";
import CheckBoxControl from "components/viewcomponents/checkbox";
const componentPaths = {
    "TextBox":Textbox,
    "View":View,
    "Button":Button,
    "Map":MapComp,
    "Label":Label,
    "CheckBoxControl":CheckBoxControl
};
export default componentPaths;
