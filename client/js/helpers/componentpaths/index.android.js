//let lazyRequire=(componentPath)=>()=>require(`promise?bluebird!${componentPath}`)
import promise from 'bluebird';
import Textbox from 'components/viewcomponents/textbox';
import View from 'components/view';
import Button from "components/viewcomponents/button"
const componentPaths = {
    "TextBox":Textbox,
    "View":View,
    "Button":Button
};
export default componentPaths;
