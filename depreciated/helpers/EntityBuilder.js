const
    //ObjectID = require("bson-objectid"),
    _ = require("lodash"),
    im = require("immutable"),
    defaultSchemaVersion = "1.0",
    //Assertions = require("./assertions.js"),
    // Creates a Record object extended with the given type.
    makeTypedRecord = require("./maketypedrecord"),


    processRevivers = function (item, model) {
        let {revivers} = item,
            reviverKeys = Object.keys(revivers);
        for (let i = 0; i < reviverKeys.length; i++) {
            let reviverKey = reviverKeys[i];
            // console.log(reviverKey);
            item = revivers[reviverKey].call(item, model);
        }

        return item;
    },

    EntitySchemaBuilders = {
        "1.0": function () {
            const
                SchemaVersion = "1.0",
                AttributeTypes = {
                    "String": "String",
                    "Choice": "Choice",
                    "Memo": "Memo",
                    "Composite": "Composite",
                    "DateTime": "DateTime"
                },

                Model = {
                    "schema": {
                        "_schemaVersion": "1.0",
                        "Id": "",
                        "Unique": "",
                        "Title": "",
                        "Name": "",
                        "Description": "",
                        "Version": "",
                        "Attributes": {}
                    },
                    "methods": {
                        "revivers": {
                            "Entity": function (model) {
                                let
                                    {Id, Unique, Title, Name, Description, Version} = model,

                                    result = this.setId(Id)
                                        .setUnique(Unique)
                                        .setTitle(Title)
                                        .setName(Name)
                                        .setDescription(Description)
                                        .setVersion(Version);

                                _.forEach(model.Attributes, function (attributeJSON) {
                                    let attribute = AttributeFactory.fromModel(attributeJSON);
                                    result = result.pushAttribute(attribute);
                                });

                                return result;
                            }
                        },

                        "validate": function () {
                            let entityRef = this;
                            let promises = [];

                            if (this.validators) {
                                let validatorsKeys = Object.keys(this.validators);
                                for (var i = 0; i < validatorsKeys.length; i++) {
                                    var validatorsKey = validatorsKeys[i];
                                    _.forEach(this.Attributes._root.entries, function (currAttr) {
                                        promises.push(entityRef.validators[validatorsKey].call(this,currAttr[1]));
                                    });
                                }

                                return Promise.all(promises);
                            }
                            return Promise.resolve();

                        },

                        "validators": {
                            "checkRequired": function (currAttr) {
                                return new Promise((resolve, reject) => {
                                    var err = null;

                                    if (currAttr.getRequired() && currAttr.getName() == "") {
                                        err = { [currAttr.getId()]: "This field is required." };
                                        return reject(err);
                                    }
                                    return resolve();
                                });
                            }
                        },

                        "pushAttribute": function (newAttribute) {
                            return this.setIn(["Attributes", newAttribute.getId()], newAttribute);
                        },

                        "getAttributeById": function (attrId) {
                            return this.Attributes.get(attrId);
                        },

                        "getAttributeSize": function () {
                            return this.getIn(["Attributes"]).count();
                        },

                        "getId": function () {
                            return this.getIn(["Id"]);
                        },
                        "setId": function (id) {
                            if (_.isString(id)) {
                                id = _.trim(id);
                                if (id.length > 0) {
                                    return this.setIn(["Id"], id);
                                }
                            }

                            return this;
                        },

                        "getUnique": function () {
                            return this.getIn(["Unique"]);
                        },
                        "setUnique": function (unique) {
                            if (_.isString(unique)) {
                                unique = _.trim(unique);
                                if (unique.length > 0) {
                                    return this.setIn(["Unique"], unique);
                                }
                            }

                            return this;
                        },

                        "getTitle": function () {
                            return this.getIn(["Title"]);
                        },
                        "setTitle": function (title) {
                            if (_.isString(title)) {
                                title = _.trim(title);
                                if (title.length > 0) {
                                    return this.setIn(["Title"], title);
                                }
                            }

                            return this;
                        },

                        "getName": function () {
                            return this.getIn(["Name"]);
                        },
                        "setName": function (name) {
                            if (_.isString(name)) {
                                name = _.trim(name);
                                if (name.length > 0) {
                                    return this.setIn(["Name"], name);
                                }
                            }

                            return this;
                        },

                        "getDescription": function () {
                            return this.getIn(["Description"]);
                        },
                        "setDescription": function (description) {
                            if (_.isString(description)) {
                                description = _.trim(description);
                                if (description.length > 0) {
                                    return this.setIn(["Description"], description);
                                }
                            }

                            return this;
                        },

                        "getVersion": function () {
                            return this.getIn(["Version"]);
                        },
                        "setVersion": function (version) {
                            if (_.isString(version)) {
                                version = _.trim(version);
                                if (version.length > 0) {
                                    return this.setIn(["Version"], version);
                                }
                            }

                            return this;
                        }
                    }
                },
                Attributes = {
                    "Base": {
                        "schema": {
                            "Id": "",
                            "Title": "",
                            "Name": "",
                            "Type": "",
                            "Description": "",
                            "MaxLength": "",
                            "MinLength": "",
                            "Required": "",
                            "Volatile": ""
                        },
                        "methods": {
                            "revivers": {
                                "Attributes": function (model) {
                                    let
                                        {Id, Title, Name, Type, Description, MaxLength, MinLength, Required, Volatile} = model,

                                        result = this.setId(Id)
                                            .setTitle(Title)
                                            .setName(Name)
                                            .setType(Type)
                                            .setDescription(Description)
                                            .setMaxLength(MaxLength)
                                            .setMinLength(MinLength)
                                            .setRequired(Required)
                                            .setVolatile(Volatile);

                                    return result;
                                }
                            },


                            "getId": function () {
                                return this.getIn(["Id"]);
                            },
                            "setId": function (id) {
                                if (_.isString(id)) {
                                    id = _.trim(id);
                                    if (id.length > 0) {
                                        return this.setIn(["Id"], id);
                                    }
                                }

                                return this;
                            },

                            "getTitle": function () {
                                return this.getIn(["Title"]);
                            },
                            "setTitle": function (title) {
                                if (_.isString(title)) {
                                    title = _.trim(title);
                                    if (title.length > 0) {
                                        return this.setIn(["Title"], title);
                                    }
                                }

                                return this;
                            },

                            "getName": function () {
                                return this.getIn(["Name"]);
                            },
                            "setName": function (name) {
                                if (_.isString(name)) {
                                    name = _.trim(name);
                                    if (name.length > 0) {
                                        return this.setIn(["Name"], name);
                                    }
                                }

                                return this;
                            },

                            "getType": function () {
                                return this.getIn(["Type"]);
                            },
                            "setType": function (type) {
                                if (_.isString(type)) {
                                    type = _.trim(type);
                                    if (type.length > 0) {
                                        return this.setIn(["Type"], type);
                                    }
                                }

                                return this;
                            },

                            "getDescription": function () {
                                return this.getIn(["Description"]);
                            },
                            "setDescription": function (description) {
                                if (_.isString(description)) {
                                    description = _.trim(description);
                                    if (description.length > 0) {
                                        return this.setIn(["Description"], description);
                                    }
                                }

                                return this;
                            },

                            "getMaxLength": function () {
                                return this.getIn(["MaxLength"]);
                            },
                            "setMaxLength": function (maxLength) {
                                if (!_.isUndefined(maxLength)) {
                                    return this.setIn(["MaxLength"], maxLength);
                                }

                                return this;
                            },

                            "getMinLength": function () {
                                return this.getIn(["MinLength"]);
                            },
                            "setMinLength": function (minLength) {
                                if (!_.isUndefined(minLength)) {
                                    return this.setIn(["MinLength"], minLength);
                                }

                                return this;
                            },

                            "getRequired": function () {
                                return this.getIn(["Required"]);
                            },
                            "setRequired": function (required) {
                                if (!_.isUndefined(required)) {
                                    return this.setIn(["Required"], required);
                                }

                                return this;
                            },

                            "getVolatile": function () {
                                return this.getIn(["Volatile"]);
                            },
                            "setVolatile": function (volatile) {
                                if (_.isString(volatile)) {
                                    volatile = _.trim(volatile);
                                    if (volatile.length > 0) {
                                        return this.setIn(["Volatile"], volatile);
                                    }
                                }

                                return this;
                            }


                        }
                    }
                },


                OptionSet = {
                    "schema": {
                        "Title": "",
                        "Value": ""
                    },
                    "methods": {
                        "revivers": {
                            "OptionSet": function (model) {
                                let
                                    {Title, Value} = model

                                return this.setTitle(Title).setValue(Value);
                            }
                        },
                        "getTitle": function () {
                            return this.getIn(["Title"]);
                        },
                        "setTitle": function (title) {
                            if (_.isString(title)) {
                                title = _.trim(title);
                                if (title.length > 0) {
                                    return this.setIn(["Title"], title);
                                }
                            }

                            return this;
                        },

                        "getValue": function () {
                            return this.getIn(["Value"]);
                        },
                        "setValue": function (value) {
                            if (_.isString(value)) {
                                value = _.trim(value);
                                if (value.length > 0) {
                                    return this.setIn(["Value"], value);
                                }
                            }

                            return this;
                        }
                    }
                };

            Attributes[AttributeTypes.String] = _.merge({},
                Attributes.Base,
                {
                    "schema": {
                        "Type": AttributeTypes.String
                    }
                }
            );

            Attributes[AttributeTypes.Memo] = _.merge({},
                Attributes.Base,
                {
                    "schema": {
                        "Type": AttributeTypes.Memo
                    }
                }
            );

            Attributes[AttributeTypes.DateTime] = _.merge({},
                Attributes.Base,
                {
                    "schema": {
                        "Type": AttributeTypes.DateTime
                    }
                }
            );

            Attributes[AttributeTypes.Choice] = _.merge({},
                Attributes.Base,
                {
                    "schema": {
                        "Type": AttributeTypes.Choice,
                        "OptionSets": []
                    },
                    "methods": {
                        "revivers": {
                            "Attributes": function (model) {
                                let
                                    {Id, Title, Name, Type, Description, MaxLength, MinLength, Required, Volatile} = model,

                                    result = this.setId(Id)
                                        .setTitle(Title)
                                        .setName(Name)
                                        .setType(Type)
                                        .setDescription(Description)
                                        .setMaxLength(MaxLength)
                                        .setMinLength(MinLength)
                                        .setRequired(Required)
                                        .setVolatile(Volatile);

                                _.forEach(model.OptionSets, function (optionSet) {
                                    let optionSchema = OptionSetFactory.fromModel(optionSet);
                                    result = result.pushOptionSet(optionSchema);
                                })

                                return result;
                            }
                        },
                        "pushOptionSet": function (optionSet) {
                            let OptionSets = this.getIn(["OptionSets"]).insert(this.getOptionSetSize(), optionSet);
                            return this.setIn(["OptionSets"], OptionSets);
                        },
                        "getOptionSetSize": function () {
                            return this.getIn(["OptionSets"]).size;
                        }
                    }
                }
            );

            Attributes[AttributeTypes.Composite] = _.merge({},
                Attributes.Base,
                {
                    "schema": {
                        "Type": AttributeTypes.Composite,
                        "Attributes": {}
                    },
                    "methods": {
                        "revivers": {
                            "Entity": function (model) {
                                let
                                    {Id, Unique, Title, Name, Description, Version} = model,

                                    result = this.setId(Id)
                                        .setUnique(Unique)
                                        .setTitle(Title)
                                        .setName(Name)
                                        .setDescription(Description)
                                        .setVersion(Version);

                                _.forEach(model.Attributes, function (attributeJSON) {
                                    let attribute = AttributeFactory.fromModel(attributeJSON);
                                    result = result.pushAttribute(attribute);
                                });

                                return result;
                            }
                        },
                        
                        "pushAttribute": function (newAttribute) {
                            return this.setIn(["Attributes", newAttribute.getId()], newAttribute);
                        },

                        "getAttributeById": function (attrId) {
                            return this.Attributes.get(attrId);
                        },

                        "getAttributeSize": function () {
                            return this.getIn(["Attributes"]).count();
                        },
                        "getId": function () {
                            return this.getIn(["Id"]);
                        },
                        "setId": function (id) {
                            if (_.isString(id)) {
                                id = _.trim(id);
                                if (id.length > 0) {
                                    return this.setIn(["Id"], id);
                                }
                            }

                            return this;
                        },

                        "getUnique": function () {
                            return this.getIn(["Unique"]);
                        },
                        "setUnique": function (unique) {
                            if (_.isString(unique)) {
                                unique = _.trim(unique);
                                if (unique.length > 0) {
                                    return this.setIn(["Unique"], unique);
                                }
                            }

                            return this;
                        },

                        "getTitle": function () {
                            return this.getIn(["Title"]);
                        },
                        "setTitle": function (title) {
                            if (_.isString(title)) {
                                title = _.trim(title);
                                if (title.length > 0) {
                                    return this.setIn(["Title"], title);
                                }
                            }

                            return this;
                        },

                        "getName": function () {
                            return this.getIn(["Name"]);
                        },
                        "setName": function (name) {
                            if (_.isString(name)) {
                                name = _.trim(name);
                                if (name.length > 0) {
                                    return this.setIn(["Name"], name);
                                }
                            }

                            return this;
                        },

                        "getDescription": function () {
                            return this.getIn(["Description"]);
                        },
                        "setDescription": function (description) {
                            if (_.isString(description)) {
                                description = _.trim(description);
                                if (description.length > 0) {
                                    return this.setIn(["Description"], description);
                                }
                            }

                            return this;
                        },

                        "getVersion": function () {
                            return this.getIn(["Version"]);
                        },
                        "setVersion": function (version) {
                            if (_.isString(version)) {
                                version = _.trim(version);
                                if (version.length > 0) {
                                    return this.setIn(["Version"], version);
                                }
                            }

                            return this;
                        }
                    }
                }
            );


            let Types = {
                "Entity": makeTypedRecord(Model),
                "Attribute": {
                    [AttributeTypes.String]: makeTypedRecord(Attributes[AttributeTypes.String]),
                    [AttributeTypes.Memo]: makeTypedRecord(Attributes[AttributeTypes.Memo]),
                    [AttributeTypes.Choice]: makeTypedRecord(Attributes[AttributeTypes.Choice]),
                    [AttributeTypes.DateTime]: makeTypedRecord(Attributes[AttributeTypes.DateTime]),
                    [AttributeTypes.Composite]: makeTypedRecord(Attributes[AttributeTypes.Composite])
                },
                "OptionSet": makeTypedRecord(OptionSet)
            },

                AttributeFactory = {
                    "createEmptyAttribute": function (type) {
                        return new Types.Attribute[type]();
                    },
                    "fromModel": function (model) {
                        let {Type} = model;
                        if (!Attributes[Type]) {
                            throw `Invalid element type - ${Type}`;
                        }
                        let element = Types.Attribute[Type]();
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
                OptionSetFactory
            }
        }

    },

    EntitySchemaBuilder = function (schemaVersion = defaultSchemaVersion) {
        return EntitySchemaBuilders[schemaVersion]();
    };


module.exports = EntitySchemaBuilder;
