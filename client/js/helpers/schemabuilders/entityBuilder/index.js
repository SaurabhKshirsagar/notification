
import Ramda from 'Ramda'

const
    _ = require("lodash"),
    im = require("immutable"),
    defaultSchemaVersion = "1.0",

    // Validate values with specified criteria
   
    Assertions = {
        "isString": function (inputString) {
            if (_.isString(inputString)) return inputString; else { throw `String ${inputString} is not valid ..!` };
        },
        "trimString" : function (inputString) {
            return _.trim(inputString);
        },
        "isEmpty" : function (inputString) {
             if (!_.isEmpty(inputString)) return inputString   ; else {    return false   };
        }
    },
    // Creates a Record object extended with the given type.
    makeTypedRecord = require("../../maketypedrecord"),


    processRevivers = function (item, model) {
        let {revivers} = item,
            reviverKeys = Object.keys(revivers);
       reviverKeys.map((key)=>{
        item=revivers[key].call(item,model)
       });
        return item;
    },

    validateId = Ramda.compose(Assertions.isEmpty, Assertions.trimString, Assertions.isString),

    EntitySchemaBuilders = {
        "1.0": function () {
            let matchedAttribute;
            const
                SchemaVersion = "1.0",
                AttributeTypes = {
                    "string": "string",
                    "list": "list",
                    "collection": "collection",
                    "choice": "choice",
                    "memo": "Memo",
                    "dateTime": "dateTime",
                    "number": "number"
                },

                Model = {
                    "schema": {
                        "_schemaVersion": "1.0",
                        "id": "",
                        "unique": "",
                        "title": "",
                        "name": "",
                        "description": "",
                        "version": "",
                        "db": {},
                        "attributes": {}
                    },
                    "methods": {
                        "revivers": {
                            "Entity": function (model) {
                                let
                                    {id, unique, title, name, description, version, db} = model,

                                    result = this.setId(id)
                                        .setUnique(unique)
                                        .setTitle(title)
                                        .setName(name)
                                        .setDescription(description)
                                        .setVersion(version)
                                        .pushDB(DBFactory.fromModel(db));

                                _.forEach(model.attributes, function (attributeJSON) {
                                    let attribute = AttributeFactory.fromModel(attributeJSON);
                                    result = result.pushAttribute(attribute);
                                });

                                return result;
                            }
                        },

                        "validate": function () {
                            return this._checkAttribute(this.attributes._root.entries);
                        },
                        "_checkAttribute": function (attributesList) {
                            let entityRef = this;
                            let promises = [];

                            if (this.validators) {
                                let validatorsKeys = Object.keys(this.validators);
                                validatorsKeys.map((validatorsKey) => {
                                    _.forEach(attributesList, function (currAttr) {
                                        if (currAttr[1].getType() == "Object" && currAttr[1].attributes.size) 
                                                entityRef._checkAttribute(currAttr[1].attributes._root.entries)
                                        promises.push(entityRef.validators[validatorsKey].call(this, currAttr[1]));
                                    });
                                })
                                return Promise.all(promises);
                            }
                            return Promise.resolve();
                        },

                        "validators": {
                            "checkRequired": function (currAttr) {
                                return new Promise((resolve, reject) => {
                                    var err = null;
                                    if (currAttr.getRequired()) {
                                        err = { [currAttr.getId()]: "This field is required." };
                                        return reject(err);
                                    }
                                    return resolve();
                                });
                            }
                        },

                        "getAttributeByTitle": function (title) {
                            matchedAttribute = null;
                            return this._checkAttributeibuteTitle(this.attributes._root.entries, title);
                        },

                        "_checkAttributeibuteTitle": function (attributesList, title) {
                            let entityRef = this;
                            _.forEach(attributesList, function (currAttr) {
                                if (currAttr[1].getType() == "Object" && currAttr[1].attributes.size)
                                    entityRef._checkAttributeibuteTitle(currAttr[1].attributes._root.entries, title);
                                if (currAttr[1].getTitle() == title) {
                                    matchedAttribute = currAttr[1];
                                    return false;
                                }
                            });

                            if (matchedAttribute)
                                return matchedAttribute;
                        },

                        "getAttributeByName": function (name) {
                            matchedAttribute = null;
                            return this._checkAttributeibuteName(this.attributes._root.entries, name);
                        },

                        "_checkAttributeibuteName": function (attributesList, name) {
                            let entityRef = this;
                            _.forEach(attributesList, function (currAttr) {
                                if (currAttr[1].getType() == "Object" && currAttr[1].attributes.size)
                                    entityRef._checkAttributeibuteName(currAttr[1].attributes._root.entries, name);
                                if (currAttr[1].getName() == name) {
                                    matchedAttribute = currAttr[1];
                                    return false;
                                }
                            });

                            if (matchedAttribute)
                                return matchedAttribute;
                        },

                        "pushAttribute": function (newAttribute) {
                           if (this.getIn(["attributes"]).size)
                            {
                                let id = newAttribute.getId();
                                let Obj = {};
                                Obj[id] = newAttribute;
                                let attributeCollection = this.getIn(["attributes"]).concat(Obj);
                                return this.setIn(["attributes"],attributeCollection);
                            }
                            return this.setIn(["attributes", newAttribute.getId()], newAttribute);
                        },

                        "pushDB": function (newDB) {
                            return this.setIn(["db"], newDB);
                        },

                        "getAttributeById": function (attrId) {
                            return this.attributes.get(attrId);
                        },

                        "getAttributeSize": function () {
                            return this.getIn(["attributes"]).count();
                        },

                        "getId": function () {
                            return this.getIn(["id"]);
                        },
                        "setId": function (id) {
                            return (id = validateId(id)) ? this.setIn(["id"], id) : this;
                        },


                        "getUnique": function () {
                            return this.getIn(["unique"]);
                        },
                        "setUnique": function (unique) {
                            return (unique = validateId(unique)) ? this.setIn(["unique"], unique) : this;
                        },

                        "getTitle": function () {
                            return this.getIn(["title"]);
                        },
                        "setTitle": function (title) {
                            return (title = validateId(title)) ? this.setIn(["title"], title) : this;
                        },

                        "getName": function () {
                            return this.getIn(["name"]);
                        },
                        "setName": function (name) {
                            return (name = validateId(name)) ? this.setIn(["name"], name) : this;
                        },

                        "getDescription": function () {
                            return this.getIn(["description"]);
                        },
                        "setDescription": function (description) {
                            return (description = validateId(description)) ? this.setIn(["description"], description) : this;
                        },

                        "getVersion": function () {
                            return this.getIn(["version"]);
                        },
                        "setVersion": function (version) {
                            return (version = validateId(version)) ? this.setIn(["version"], version) : this;
                        }
                    }
                },

                DB = {
                    "schema": {
                        "type": "",
                        "url": "",
                        "entityPath": ""
                    },
                    "methods": {
                        "revivers": {
                            "DB": function (model) {
                                let
                                    {type, url, entityPath} = model;

                                return this.setType(type).setURL(url).setEntityPath(entityPath);
                            }
                        },

                        "getType": function () {
                            return this.getIn(["type"]);
                        },
                        "setType": function (Db_type) {
                            return (Db_type = validateId(Db_type)) ? this.setIn(["type"], Db_type) : this;
                        },

                        "getURL": function () {
                            return this.getIn(["url"]);
                        },
                        "setURL": function (Db_Name) {
                            return (Db_Name = validateId(Db_Name)) ? this.setIn(["url"], Db_Name) : this;
                        },

                        "getEntityPath": function () {
                            return this.getIn(["entityPath"]);
                        },
                        "setEntityPath": function (Db_entity) {
                            return (Db_entity = validateId(Db_entity)) ? this.setIn(["entityPath"], Db_entity) : this;
                        }

                    }
                },

                Attributes = {
                    "Base": {
                        "schema": {
                            "id": "",
                            "title": "",
                            "name": "",
                            "type": "",
                            "description": "",
                            "maxLength": "",
                            "minLength": "",
                            "required": "",
                            "volatile": "",
                            "of":""
                        },
                        "methods": {
                            "revivers": {
                                "Attributes": function (model) {
                                    let
                                        {id, title, name, type, description, maxLength, minLength, required, volatile, of} = model,

                                        result = this.setId(id)
                                            .setTitle(title)
                                            .setName(name)
                                            .setType(type)
                                            .setDescription(description)
                                            .setMaxLength(maxLength)
                                            .setMinLength(minLength)
                                            .setRequired(required)
                                            .setVolatile(volatile)
                                            .setOf(of);

                                    return result;
                                }
                            },


                            "getId": function () {
                                return this.getIn(["id"]);
                            },
                            "setId": function (id) {
                                return (id = validateId(id)) ? this.setIn(["id"], id) : this;
                            },

                            "getTitle": function () {
                                return this.getIn(["title"]);
                            },
                            "setTitle": function (title) {
                                return (title = validateId(title)) ? this.setIn(["title"], title) : this;
                            },

                            "getName": function () {
                                return this.getIn(["name"]);
                            },
                            "setName": function (name) {
                                return (name = validateId(name)) ? this.setIn(["name"], name) : this;
                            },

                            "getType": function () {
                                return this.getIn(["type"]);
                            },
                            "setType": function (type) {
                                return (type = validateId(type)) ? this.setIn(["type"], type) : this;
                            },
                             "getOf": function () {
                                return this.getIn(["of"]);
                            },
                            "setOf": function (Of) {
                                return (Of = validateId(Of)) ? this.setIn(["of"], Of) : this;
                            },

                            "getDescription": function () {
                                return this.getIn(["description"]);
                            },
                            "setDescription": function (description) {
                                return (description = validateId(description)) ? this.setIn(["description"], description) : this;
                            },

                            "getMaxLength": function () {
                                return this.getIn(["maxLength"]);
                            },
                            "setMaxLength": function (maxLength) {
                                if (!_.isUndefined(maxLength)) {
                                    return this.setIn(["maxLength"], maxLength);
                                }

                                return this;
                            },

                            "getMinLength": function () {
                                return this.getIn(["minLength"]);
                            },
                            "setMinLength": function (minLength) {
                                if (!_.isUndefined(minLength)) {
                                    return this.setIn(["minLength"], minLength);
                                }

                                return this;
                            },

                            "getRequired": function () {
                                return this.getIn(["required"]);
                            },
                            "setRequired": function (required) {
                                if (!_.isUndefined(required)) {
                                    return this.setIn(["required"], required);
                                }

                                return this;
                            },

                            "getVolatile": function () {
                                return this.getIn(["volatile"]);
                            },
                            "setVolatile": function (volatile) {
                                 if (!_.isUndefined(volatile)) {
                                    return this.setIn(["volatile"], volatile);
                                }

                                return this; 
                             }


                        }
                    }
                },


                OptionSet = {
                    "schema": {
                        "title": "",
                        "value": ""
                    },
                    "methods": {
                        "revivers": {
                            "OptionSet": function (model) {
                                let
                                    {title, value} = model

                                return this.setTitle(title).setValue(value);
                            }
                        },
                        "getTitle": function () {
                            return this.getIn(["title"]);
                        },
                        "setTitle": function (title) {
                            return (title = validateId(title)) ? this.setIn(["title"], title) : this;
                        },

                        "getValue": function () {
                            return this.getIn(["value"]);
                        },
                        "setValue": function (value) {
                            return (value = validateId(value)) ? this.setIn(["value"], value) : this;
                        }
                    }
                };

            Attributes[AttributeTypes.string] = _.merge({},
                Attributes.Base,
                {
                    "schema": {
                        "type": AttributeTypes.string
                    }
                }
            );

            Attributes[AttributeTypes.memo] = _.merge({},
                Attributes.Base,
                {
                    "schema": {
                        "type": AttributeTypes.memo
                    }
                }
            );

            Attributes[AttributeTypes.number] = _.merge({},
                Attributes.Base,
                {
                    "schema": {
                        "type": AttributeTypes.number
                    }
                }
            );

            Attributes[AttributeTypes.dateTime] = _.merge({},
                Attributes.Base,
                {
                    "schema": {
                        "type": AttributeTypes.dateTime
                    }
                }
            );

            Attributes[AttributeTypes.choice] = _.merge({},
                Attributes.Base,
                {
                    "schema": {
                        "type": AttributeTypes.choice,
                        "optionSets": []
                    },
                    "methods": {
                        "revivers": {
                            "Attributes": function (model) {
                                let
                                     {id, title, name, type, description, maxLength, minLength, required, volatile, of} = model,

                                    result = this.setId(id)
                                        .setTitle(title)
                                        .setName(name)
                                        .setType(type)
                                        .setDescription(description)
                                        .setMaxLength(maxLength)
                                        .setMinLength(minLength)
                                        .setRequired(required)
                                        .setVolatile(volatile)
                                        .setOf(of);

                                _.forEach(model.OptionSets, function (optionSet) {
                                    let optionSchema = OptionSetFactory.fromModel(optionSet);
                                    result = result.pushOptionSet(optionSchema);
                                })

                                return result;
                            }
                        },
                        "pushOptionSet": function (optionSet) {
                            let OptionSets = this.getIn(["optionSets"]).insert(this.getOptionSetSize(), optionSet);
                            return this.setIn(["optionSets"], OptionSets);
                        },
                        "getOptionSetSize": function () {
                            return this.getIn(["optionSets"]).size;
                        }
                    }
                }
            );

            Attributes[AttributeTypes.list] = _.merge({},
                Attributes.Base,
                {
                    "schema": {
                        "type": AttributeTypes.list,
                        "optionSets": []
                    },
                    "methods": {
                        "revivers": {
                            "Attributes": function (model) {
                                let
                                    {id, title, name, type, description, maxLength, minLength, required, volatile, of} = model,

                                    result = this.setId(id)
                                        .setTitle(title)
                                        .setName(name)
                                        .setType(type)
                                        .setDescription(description)
                                        .setMaxLength(maxLength)
                                        .setMinLength(minLength)
                                        .setRequired(required)
                                        .setVolatile(volatile)
                                        .setOf(of);

                                _.forEach(model.OptionSets, function (optionSet) {
                                    let optionSchema = OptionSetFactory.fromModel(optionSet);
                                    result = result.pushOptionSet(optionSchema);
                                })

                                return result;
                            }
                        },
                        "pushOptionSet": function (optionSet) {
                            let OptionSets = this.getIn(["optionSets"]).insert(this.getOptionSetSize(), optionSet);
                            return this.setIn(["optionSets"], OptionSets);
                        },
                        "getOptionSetSize": function () {
                            return this.getIn(["optionSets"]).size;
                        }
                    }
                }
            );

            Attributes[AttributeTypes.collection] = _.merge({},
                Attributes.Base,
                {
                    "schema": {
                        "type": AttributeTypes.collection,
                        "attributes": {}
                    },
                    "methods": {
                        "revivers": {
                            "Entity": function (model) {
                                let
                                      {id, title, name, type, description, maxLength, minLength, required, volatile, of} = model,

                                    result = this.setId(id)
                                        .setTitle(title)
                                        .setName(name)
                                        .setType(type)
                                        .setDescription(description)
                                        .setMaxLength(maxLength)
                                        .setMinLength(minLength)
                                        .setRequired(required)
                                        .setVolatile(volatile)
                                        .setOf(of);

                                _.forEach(model.attributes, function (attributeJSON) {
                                    let attribute = AttributeFactory.fromModel(attributeJSON);
                                    result = result.pushAttribute(attribute);
                                });

                                return result;
                            }
                        },

                        "pushAttribute": function (newAttribute) {
                           if (this.getIn(["attributes"]).size)
                            {
                                let id = newAttribute.getId();
                                let Obj = {};
                                Obj[id] = newAttribute;
                                let attributeCollection = this.getIn(["attributes"]).concat(Obj);
                                return this.setIn(["attributes"],attributeCollection);
                            }
                            return this.setIn(["attributes", newAttribute.getId()], newAttribute);
                        },

                        "getAttributeById": function (attrId) {
                            return this.Attributes.get(attrId);
                        },

                        "getAttributeSize": function () {
                            return this.getIn(["attributes"]).count();
                        },
                        "getId": function () {
                            return this.getIn(["id"]);
                        },
                        "setId": function (id) {
                            return (id = validateId(id)) ? this.setIn(["id"], id) : this;
                        },

                        "getUnique": function () {
                            return this.getIn(["unique"]);
                        },
                        "setUnique": function (unique) {
                            return (unique = validateId(unique)) ? this.setIn(["unique"], unique) : this;
                        },

                        "getTitle": function () {
                            return this.getIn(["title"]);
                        },
                        "setTitle": function (title) {
                            return (title = validateId(title)) ? this.setIn(["title"], title) : this;
                        },

                        "getName": function () {
                            return this.getIn(["name"]);
                        },
                        "setName": function (name) {
                            return (name = validateId(name)) ? this.setIn(["name"], name) : this;
                        },

                        "getDescription": function () {
                            return this.getIn(["description"]);
                        },
                        "setDescription": function (description) {
                            return (description = validateId(description)) ? this.setIn(["description"], description) : this;
                        },

                        "getVersion": function () {
                            return this.getIn(["version"]);
                        },
                        "setVersion": function (version) {
                            return (version = validateId(version)) ? this.setIn(["version"], version) : this;
                        }
                    }
                }
            );


            let Types = {
                "Entity": makeTypedRecord(Model),
                "Attribute": {
                    [AttributeTypes.string]: makeTypedRecord(Attributes[AttributeTypes.string]),
                    [AttributeTypes.memo]: makeTypedRecord(Attributes[AttributeTypes.memo]),
                    [AttributeTypes.choice]: makeTypedRecord(Attributes[AttributeTypes.choice]),
                    [AttributeTypes.list]: makeTypedRecord(Attributes[AttributeTypes.list]),
                    [AttributeTypes.dateTime]: makeTypedRecord(Attributes[AttributeTypes.dateTime]),
                    [AttributeTypes.collection]: makeTypedRecord(Attributes[AttributeTypes.collection]),
                    [AttributeTypes.number]: makeTypedRecord(Attributes[AttributeTypes.number])
                },
                "OptionSet": makeTypedRecord(OptionSet),
                "DB": makeTypedRecord(DB)
            },

                AttributeFactory = {
                    "createEmptyAttribute": function (type) {
                        return new Types.Attribute[type]();
                    },
                    "fromModel": function (model) {
                        let {type} = model;
                        if (!Attributes[type]) {
                            throw `Invalid element type - ${type}`;
                        }
                        let element = Types.Attribute[type]();
                        return processRevivers(element, model);
                    }
                },

                OptionSetFactory = {
                    "createEmptyOptionSet": function () {
                        return new Types.OptionSet();
                    },
                    "fromModel": function (model) {
                        let optionSet = new Types.OptionSet();
                        return processRevivers(optionSet, model);
                    }
                },

                DBFactory = {
                    "createEmptyDB": function () {
                        return new Types.DB();
                    },
                    "fromModel": function (model) {
                        let DB = new Types.DB();
                        return processRevivers(DB, model);
                    }
                };


            return {
                "createEmptyEntity": function () {
                    return new Types.Entity();
                },
                "fromModel": function (model) {
                    let entity = new Types.Entity();
                    return processRevivers(entity, model);
                },
                AttributeFactory,
                OptionSetFactory,
                DBFactory
            }
        }

    },

    EntitySchemaBuilder = function (schemaVersion = defaultSchemaVersion) {
        return EntitySchemaBuilders[schemaVersion]();
    };


module.exports = EntitySchemaBuilder;
