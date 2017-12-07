//let lazyRequire=(componentPath)=>()=>require(`promise?bluebird!${componentPath}`)
const componentPaths = {
    "TextBox":require("promise?bluebird,components!components/viewcomponents/textbox"),
    "Map":require("promise?bluebird,components!components/map"),
    "Button":require("promise?bluebird,components!components/forms/button"),
    "DropdownButton":require("promise?bluebird,components!components/forms/dropdownbutton"),
    "Form":require("promise?bluebird,components!components/forms/form"),
    "Image":require("promise?bluebird,components!components/forms/image"),
    "Link":require("promise?bluebird,components!components/forms/link"),
    "MenuItem":require("promise?bluebird,components!components/forms/menuitem"),
    "Password":require("promise?bluebird,components!components/forms/password"),
    "AvatarView":require("promise?bluebird,components!components/forms/avatarview"),
    "FormGroup":require("promise?bluebird,components!components/forms/formgroup"),
    "View":require("promise?bluebird,components!components/view"),
    "List":require("promise?bluebird,components!components/list"),
    "DateControl":require("promise?bluebird,components!components/viewcomponents/date"),
    "Label":require("promise?bluebird,components!components/label"),
    "CheckBoxControl":require("promise?bluebird,components!components/viewcomponents/checkbox"),
    "DropdownControl":require("promise?bluebird,components!components/viewcomponents/dropdown")
    
};
export default componentPaths;
