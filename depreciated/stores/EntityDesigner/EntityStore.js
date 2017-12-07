import Reflux from 'reflux';
import _ from 'lodash';
import R from 'ramda'
import babelpollyFill from "babel-polyfill";
//Actions
import actions from '../../actions/EntityDesigner/action';
//Wrapper
import axiosCall from 'helpers/EntityDesigner/helper';
import AppContext from 'helpers/RuntimeAppContext';
import EntityAPI from 'helpers/EntityApi';
import ErrorMessages from 'helpers/Constants/ErrorMessages/EntitySchemaDesigner';
//import EntitySchemaBuilder from '../../helpers/schemaBuilders/entityBuilder';
import DbContext from 'helpers/PersistenceLayer/index.js'
import ObjectID from "bson-objectid";

const specialChar = /^[a-zA-Z0-9- ]*$/;


const candidateJSON =
    [{
        "Name": "FirstName",
        "Title": "First Name",
        "Description": "test first name",
        "Type": "string"
    },
        {
            "Name": "LastName",
            "Title": "last Name",
            "Description": "test last name",
            "Type": "Object",
            "Attributes":
            [{
                "Name": "test"
            }]

        },
        {
            "Name": "MiddleName",
            "Title": "Middle Name",
            "Description": "test first name",
            "Type": "string"
        },
        {
            "Name": "Email",
            "Title": "Email",
            "Description": "test Email",
            "Type": "string"
        },
        {
            "Name": "MobileNumber",
            "Title": "MobileNumber",
            "Description": "test MobileNumber",
            "Type": "string"
        },
        {
            "Name": "CellPhone",
            "Title": "CellPhone",
            "Description": "test CellPhone",
            "Type": "string"
        },
        {
            "Name": "MartialStatus",
            "Title": "MartialStatus",
            "Description": "test MartialStatus",
            "Type": "string"
        },
        {
            "Name": "TaxId",
            "Title": "TaxId",
            "Description": "test TaxId",
            "Type": "string"
        },
        {
            "Name": "FederalId",
            "Title": "FederalId",
            "Description": "test FederalId",
            "Type": "string"
        },
        {
            "Name": "Passport",
            "Title": "Passport",
            "Description": "test Passport",
            "Type": "string"
        },
        {
            "Name": "CountryTravelled",
            "Title": "CountryTravelled",
            "Description": "test CountryTravelled",
            "Type": "string"
        },
        {
            "Name": "Nationality",
            "Title": "Nationality",
            "Description": "test Nationality",
            "Type": "string"
        },
        {
            "Name": "CityzenState",
            "Title": "CityzenState",
            "Description": "test CityzenState",
            "Type": "string"
        },
        {
            "Name": "Ethinicity",
            "Title": "Ethinicity",
            "Description": "test Ethinicity",
            "Type": "string"
        },
        {
            "Name": "Gender",
            "Title": "Gender",
            "Description": "test Gender",
            "Type": "string"
        },
        {
            "Name": "Date Of Birth",
            "Title": "Date Of Birth",
            "Description": "test Date Of Birth",
            "Type": "string"
        },
        {
            "Name": "Gender",
            "Title": "Gender",
            "Description": "test Gender",
            "Type": "string"
        },
        {
            "Name": "BirthPlace",
            "Title": "BirthPlace",
            "Description": "test BirthPlace",
            "Type": "string"
        }
    ]


const schema = "/Schemas/EntitySchema/";
let schemaPath = ["Schemas", "EntitySchema"];
//let builder = EntitySchemaBuilder();
let EntityStore = Reflux.createStore({
    listenables: [actions],
    entities: [],
    init: function () {
    },
    onFetchEntitySchema: function (url) {
        //  DbContext.get(schemaPath)
        EntityAPI.loadEntitySchema()
            .then((value) => {
                this.entities = value;
                this.trigger(this.entities);
                actions.fetchEntitySchema.completed("completed");
            })
            .catch((e) => {
                console.log(e);
                actions.fetchEntitySchema.failed("failed");
            });
    },
    isNameAvailable: function (name) {
        return new Promise((resolve, reject) => {
            if (_.some(this.entities, { 'Name': name })) reject(ErrorMessages.Exist)
            else resolve(name);
        });
    },
    specialCharValidation: function (name) {
        return new Promise((resolve, reject) => {
            if (specialChar.test(name)) {
                resolve(name);
            }
            else {
                reject(ErrorMessages.InvalidName);
            }
        });
    },
    //Create the entity schema on server
    onCreateEntitySchema: function (data, context, unmountVariable) {
        let  entityJSON,Name;
        this.specialCharValidation(data.Name)
            .then(this.isNameAvailable)
            .then(() => {
                entityJSON = this.CreateEntityJSON(data);
                Name = entityJSON.Name;
                return EntityAPI.createEntitySchema([Name], entityJSON)
            })
            .then(() => {
                _.set(this.entities, [Name], entityJSON);
                AppContext.unmount([unmountVariable]);
                this.trigger(this.entities);
                actions.createEntitySchema.completed("completed");
            })
            .catch((e) => {
                console.log(e);
                actions.createEntitySchema.failed("fail");
            });
    },
    //Update the entity on server
    onUpdateEntitySchema: function (data, context, unmountVariable) {
        if (!_.isEmpty(data)) {
            _.unset(data, ["showModal"]);
            let {Name} = context.props.selected;
            return EntityAPI.updateEntitySchema([Name], data)
            .then(() => {
                let entityJSON = this.buildJson(data, context.props.selected);
                _.set(this.entities, [Name], entityJSON);
                AppContext.unmount([unmountVariable]);
                this.trigger(this.entities);
                actions.updateEntitySchema.completed("completed");
            })
            .catch((e) => {
                console.error(e);
                actions.updateEntitySchema.failed("failed");
            });
        }
    },
    //delete the entity from server
    onDeleteEntitySchema: function (data, context) {
        if (confirm(`are you want to delete ${data.Title ? data.Title : ''}`)) {
            let {Name} = data;
            EntityAPI.deleteEntitySchema([Name])
                .then(() => {
                    _.unset(this.entities, [Name]);
                    this.trigger(this.entities);
                    actions.deleteEntitySchema.completed("completed");
                })
                .catch((e) => {
                    console.log(e);
                    actions.deleteEntitySchema.failed("failed");
                })
        }
    },
    onCreateFieldSchema: function (data, context, unmountVariable) {

        let entityAttributeJSON = this.createAttributesJSON(data);
        let attributeId = ObjectID().str;//this.getGuid();
        _.set(data, ["Id"], attributeId);
        let {Name} = context.props.parentSelected;

        EntityAPI.createEntitySchema([Name, "Attributes", attributeId], entityAttributeJSON)
            //DbContext.save(_.concat(schemaPath, Name, "Attributes", attributeId), entityAttributeJSON)
            .then(() => {
                // this.updateEntitySchemaVersion(context.props.parentSelected);
                _.set(this.entities, [Name, "Attributes", attributeId], entityAttributeJSON);
                AppContext.unmount([unmountVariable]);
                this.trigger(this.entities);
                actions.createFieldSchema.completed("completed");
            })
            .catch((e) => {
                console.log(e);
                actions.createFieldSchema.failed("failed");
            });
    },
    onUpdateEntityFieldSchema: function (data, context, unmountVariable) {
        _.unset(data, ["showModal"]);
        let {Name: EntityName} = context.props.parentSelected;
        let {Id: attributeId} = context.props.selected;

        EntityAPI.updateEntitySchema([EntityName, "Attributes", attributeId], data)
            //DbContext.update(_.concat(schemaPath, EntityName, "Attributes", attributeId), data)
            .then(() => {
                //   this.updateEntitySchemaVersion(context.props.parentSelected);
                let entityFieldJSON = this.buildJson(data, context.props.selected);
                _.set(this.entities, [EntityName, "Attributes", attributeId], entityFieldJSON);
                AppContext.unmount([unmountVariable]);
                this.trigger(this.entities);
                actions.updateEntityFieldSchema.completed("completed");
            })
            .catch((e) => {
                console.log(e);
                actions.updateEntityFieldSchema.failed("failed");
            });
    },
    onDeleteEntityFieldSchema: function (data, context) {
        if (confirm(`are you want to delete ${data.Title ? data.Title : ''}`)) {
            let {Name} = context.props.parentSelected;
            let attributeId = data.Id;
            EntityAPI.deleteEntitySchema([Name, "Attributes", attributeId])
                //DbContext.delete(_.concat(schemaPath, Name, "Attributes", attributeId))
                .then(() => {
                    alert(`${data.Name} deleted successfully`);
                    _.unset(this.entities, [Name, "Attributes", attributeId]);
                    this.trigger(this.entities);
                    actions.deleteEntityFieldSchema.completed("completed");
                })
                .catch((e) => {
                    console.log(e);
                    actions.deleteEntityFieldSchema.failed("failed");
                });
        }
    },
    //Create the JSON object from formrender 
    buildJson: function (data, entity) {
        _.forIn(entity, (value, key) => {
            if (_.get(data, key) != undefined) {
                _.set(entity, [key], _.get(data, key));
            }
        });
        return entity;
    },
    //Create the entity JSON object from the JSON object
    CreateEntityJSON: function (data) {
        //let uniqueKey = data['Unique'];
        // data["Id"] = this.getGuid();
        data["Id"] = ObjectID().str;
        this.addIdAttribute(data);
        this.addUniqueKey(data);
        let dbString = {
            Db_type: "firebase",
            Db_Name: "https://peoplesure-4df9a.firebaseio.com",
            Db_entity: "/EntityData/CandidateList"
        }
        _.set(data, ["DbMapping"], dbString);
        //   _.set(data, ["Version"], "1.0");
        return _.omit(data, ["Unique"], ["$type"]);
        //_.omit(data,["Unique.Name","Unique.Title","Unique.Description"]);
    },
    //Generate the sysytem Id Fields in the entity
    addIdAttribute: function (data) {
        // let guid = this.getGuid();
        let guid = ObjectID().str;
        data["UniqueKey"] = data["Unique"]["Name"];
        data["Attributes"] = [];
        data["Attributes"][guid] =
            {
                Id: guid,
                Title: "ID",
                Name: "Id",
                // SchemaName: "_id",
                Description: "Read only field created by the system",
                MaxLength: '',
                MinLength: '',
                Required: "false",
                Type: "string"
            };
        return data;
    },
    //Add the Unique key in the entity
    addUniqueKey: function (data) {
        let uniqueKeyName = data['Unique']['Name'];
        //  let uniqueKeySchemaName = data['Unique.SchemaName'];
        let uniqueKeyTitle = data['Unique']['Title'];
        //let guid = this.getGuid();
        let guid = ObjectID().str;
        data["Attributes"][guid] =
            {
                Id: guid,
                Title: uniqueKeyTitle,
                Name: uniqueKeyName,
                Description: "Read only field created by the user",
                MaxLength: '',
                MinLength: '',
                Required: "true",
                Type: "number"
            };
        return data;
    },
    //Create the Unique GUID for the Entity and Attributes
    getGuid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },
    createAttributesJSON: function (data) {
        let self = this;
        let getJSONFromDataType = {
            'string': function () {
                return data;
            },
            'number': function () {
                return data;
            },
            'date': function () {
                return data;
            },
            'memo': function () {
                return data;
            },
            'choice': function () {
                return data;
            },
            'yesno': function () {
                return data;
            },
            'object': function () {
                var newObj = candidateJSON.reduce(function (obj, current) {
                    let guid = ObjectID().str;//self.getGuid();
                    _.set(current, ['Id'], guid);
                    _.set(obj, [guid], current);
                    return obj;
                }, {});
                return _.set(data, ["Attributes"], newObj);
            }
        };
        return getJSONFromDataType[data.Type ? data.Type.toLowerCase() : "string"]();
    },
    updateEntitySchemaVersion: function (data) {
        let {Version} = data;
        _.set(data, ["Version"], (parseFloat(Version) + 0.1).toFixed(2));
        DbContext.update(_.concat(schemaPath, data.Name), data)
            .then((value) => {
                console.log("schema version changed");
            })
            .catch((e) => {
                console.log(e);
            })
    }
});
export default EntityStore;