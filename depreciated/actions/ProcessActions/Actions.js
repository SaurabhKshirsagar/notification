import EntityActions from '../EntityDesigner/action'
import FormAction from '../FormActions/FormAction'
import gridAction from '../FormActions/GridActions'
import engineAction from 'engine/actions'

let Actions = {
    entityActions: {
        "createEntitySchema": {
            "refluxAction": function (params) {
                let {data, context,unmountVariable} = params;
                return EntityActions.createEntitySchema.triggerAsync(data, context,unmountVariable);
            },
            "label": "Save Entity",
            "description": "Saves an entity in the database",
            "params": {
                "data": {
                    "type": "object",
                    "required": true,
                    "label": "data",
                    "description": "create new entity"
                }
            },
            "returnType": "variable"
        },
        "updateEntitySchema": {
            "refluxAction": function (params) {
                let {data, context,unmountVariable} = params;
                return EntityActions.updateEntitySchema.triggerAsync(data, context,unmountVariable);
            },
            "label": "updateEntity Entity",
            "description": "updateEntity an entity in the database",
            "params": {
                "data": {
                    "type": "string",
                    "required": true,
                    "label": "Entity",
                    "description": "Update entity"
                }
            },
            "returnType": "void"
        },
        "createFieldSchema": {
            "refluxAction": function (params) {
                let {data, context,unmountVariable} = params;
                return EntityActions.createFieldSchema.triggerAsync(data, context,unmountVariable);
            },
            "label": "Save Entity",
            "description": "Saves an entity fields schema in the database",
            "params": {
                "data": {
                    "type": "object",
                    "required": true,
                    "label": "data",
                    "description": "create new entity field schema"
                }
            },
            "returnType": "variable"
        },
        "updateEntityFieldSchema": {
            "refluxAction": function (params) {
                let {data, context,unmountVariable} = params;
                return EntityActions.updateEntityFieldSchema.triggerAsync(data, context,unmountVariable);
            },
            "label": "updateEntity Entity",
            "description": "updateEntity an entity in the database",
            "params": {
                "data": {
                    "type": "string",
                    "required": true,
                    "label": "Entity",
                    "description": "Update entity field schema"
                }
            },
            "returnType": "void"
        },
    },
    formActions: {
        "CloseForm": {
            "refluxAction": function (params) {
                console.log("RE CloseForm")
                return FormAction.CloseForm.triggerAsync();
            },
            "label": "Test Action",
            "description": "Test Action",
            "params": {
                "message": {
                    "type": "String",
                    "required": true,
                    "label": "Test String",
                    "description": "Test"
                }
            },
            "returnType": "veriable"
        },
        "Action1": {
            "refluxAction": function (params) {
                console.log("RE Action1")
                let {message,CandidateObj,ComposeAddress} = params;
                return FormAction.Action1.triggerAsync(message,CandidateObj,ComposeAddress);
            },
            "label": "Test Action",
            "description": "Test Action",
            "params": {
                "message": {
                    "type": "String",
                    "required": true,
                    "label": "Test String",
                    "description": "Test"
                }
            },
            "returnType": "veriable"
        },
        "Action2": {
            "refluxAction": function (params) {
                console.log("RE Action2")
                let {message,Address} = params;
                return FormAction.Action2.triggerAsync(message,Address);
            },
            "label": "Test Action2",
            "description": "Test Action2",
            "params": {
                "message": {
                    "type": "String",
                    "required": true,
                    "label": "Test String",
                    "description": "Test"
                }
            },
            "returnType": "void"
        },
        "Action3": {
            "refluxAction": function (params) {
                console.log("RE Action3")
                let {message} = params;
                return FormAction.Action3.triggerAsync(message);
            },
            "label": "Test Action3",
            "description": "Test Action3",
            "params": {
                "data": {
                    "type": "String",
                    "required": true,
                    "label": "Test String",
                    "description": "Test"
                }
            },
            "returnType": "veriable"
        }
    },
     GridActions: {
        "SaveForm": {
            "refluxAction": function (params) {
                 let {data} = params;
                return gridAction.SaveForm.triggerAsync(data);
            },
            "label": "Test Action",
            "description": "Test Action",
            "params": {
                "message": {
                    "type": "String",
                    "required": true,
                    "label": "Test String",
                    "description": "Test"
                }
            },
            "returnType": "veriable"
        },
        "DeleteEntity": {
            "refluxAction": function (params) {
                console.log("RE Action2")
                let {id,data} = params;
                return gridAction.Action2.triggerAsync(id,data);
            },
            "label": "Test Action2",
            "description": "Test Action2",
            "params": {
                "message": {
                    "type": "String",
                    "required": true,
                    "label": "Test String",
                    "description": "Test"
                }
            },
            "returnType": "void"
        }
    },
    Framework:{
        "openModule":{
             "refluxAction": function (params) {
                let {moduleId,currentNavigation} = params;
                return engineAction.OpenModule.triggerAsync(moduleId,currentNavigation);
            },
            "label": "openModule",
            "description": "open module and mount navigation",
            "params": {
                "moduleid": {
                    "type": "string",
                    "required": true,
                    "label": "openModule",
                    "description": "openModule"
                }
            },
            "returnType": "variable"
        }

    }

}

export default Actions;