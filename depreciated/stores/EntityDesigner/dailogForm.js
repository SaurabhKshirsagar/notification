import Reflux from 'reflux';
import axios from 'axios';
//Actions
import actions from '../../actions/EntityDesigner/dailogFrom'
let DailogFormStore = Reflux.createStore({
    listenables: [actions],
    dlgFields: [],
    init: function () {
    },
    onCreateEntityForm: function (enties, key) {
        let fields = this.getFields(key);
        this.dlgFields["fields"] = fields;
        this.dlgFields[key] = true;
        this.dlgFields["Action"] = 'create';
        this.trigger(this.dlgFields);
    },
    //This the Temporary function to create the entity and entity fields form schema using the fields
    getFields:function(key,data){
        switch(key){
            case 'EntityGridActions':
            return[ { field: "Name", value: data?data.Name:"" },
                   
                    { field: "Title", value: data?data.Title:"" },
                    { field: "Version", value: data?data.Version:"" },
                    { field: "Description", value:data?data.Description: "" },
                    { field: "Unique", value:data?data.UniqueKey:"" }
                ];
            case 'FieldGridActions':
             return[ { field: "Name", value: data?data.Name: "" },
                  
                    { field: "Title", value: data?data.Title: "" },
                    { field: "Type", value: data?data.Type: "" },
                    { field: "Description", value: data?data.Description: "" },
                    { field: "required", value:  data?data.Required:"" },
                    { field: "Max Length", value: data?data.MaxLength: "" },
                    { field: "Min Length", value:  data?data.MinLength:"" }
                ];
        }
    },
    onUpdateEntityForm: function (enties,key) {
        if (enties.length >= 0) {
            alert('please select the row');
            return false;
        }
        this.dlgFields = [];
        let fields =this.getFields(key,enties);
        this.dlgFields["fields"] = fields;
        this.dlgFields[key] = true;
        this.dlgFields["Action"] = 'edit';
        this.trigger(this.dlgFields);
    },
    onDeleteEntityForm: function (entity) {
        if (entity.length >= 0) {
            alert('please select the row');
            return false;
        }
        if (confirm(`are you want to delete ${entity.Title}`)) {
            let entityId = entity.Id;
            console.log(entityId);
        }
    }
});
export default DailogFormStore;