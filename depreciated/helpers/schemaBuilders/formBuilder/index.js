const
    //ObjectID = require("bson-objectid"),
    _ = require("lodash"),
    im = require("immutable"),
    defaultSchemaVersion = "1.0",
    //Assertions = require("./assertions.js"),

    // Creates a Record object extended with the given type.
    makeTypedRecord = require("../maketypedrecord"),


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
    
    FormSchemaBuilders = {
        "1.0": function () {
            const
                SchemaVersion = "1.0",
                ElementTypes = {
                    "TextBox": "TextBox",
                    "DropDown": "DropDown",
                    "Textarea": "Textarea"
                },
                Model = {
                    "schema": {
                        "_schemaVersion": "1.0",
                        "id": "",
                        "title": "",
                        "type": "",
                        "successMessage": "",
                        "viewOnly": "",
                        "businessProcessFlow": "",
                        "showButtonControls": "",
                        "cssPath": "",
                        "layoutColumnsCount": "",
                        "transactionId": "",
                        "populateEntityId": "",
                        "elements": []
                    },
                    "methods": {
                        "revivers": {
                            "Form": function (model) {
                                let
                                    {id, title, type, successMessage, viewOnly, businessprocessflow,
                                        showButtonControls, cssPath, layoutColumnsCount, transactionId,
                                        populateEntityId} = model,

                                    result = this.setId(id)
                                        .setTitle(title)
                                        .setType(type)
                                        .setSuccessMessage(successMessage)
                                        .setViewOnly(viewOnly)
                                        .setBusinessProcessFlow(businessprocessflow)
                                        .setShowButtonControls(showButtonControls)
                                        .setCssPath(cssPath)
                                        .setLayoutColumnsCount(layoutColumnsCount)
                                        .setTransactionId(transactionId)
                                        .setPopulateEntityId(populateEntityId);



                                _.forEach(model.Elements, function (elementJSON) {
                                    let element = ElementFactory.fromModel(elementJSON);
                                    result = result.pushElement(element);
                                    //console.log(element);
                                });

                                return result;
                            }

                        },

                        "pushElement": function (element) {
                            let elements = this.getIn(["elements"]).insert(this.getElementSize(), element);
                            return this.setIn(["elements"], elements);
                        },

                        "getElementAt": function (index) {
                            let element = this.get("elements").get(index);
                            return element;
                        },

                        "removeLastElement": function () {
                            let elements = this.get("elements").pop();
                            return this.setIn(["elements"], elements);
                        },

                        "removeElementAt": function (index) {
                            let elements = this.get("elements").deleteIn(index);
                            return this.setIn(["elements"], elements);
                        },

                        "moveElement": function (oldIndex, newIndex) {
                            if (newIndex == oldIndex) {
                                return this;
                            }

                            if (newIndex == -1) {
                                return this;
                            }

                            if (newIndex > this.getElementSize()) {
                                return this;
                            }

                            let elementToMove = this.getIn(["elements", oldIndex]),
                                result = this.deleteIn(["elements", oldIndex]),
                                elements = result.getIn(["elements"]).insert(newIndex, elementToMove);

                            return result.setIn(["elements"], elements);
                        },

                        "getElementSize": function () {
                            return this.getIn(["elements"]).size;
                        },

                        "getId": function () {
                            return this.getIn(["id"]);
                        },
                        "setId": function (id) {
                            if (!_.isUndefined(id)) {
                                return this.setIn(["id"], id);
                            }

                            return this;
                        },

                        "getTitle": function () {
                            return this.getIn(["title"]);
                        },
                        "setTitle": function (title) {
                            if (_.isString(title)) {
                                title = _.trim(title);
                                if (title.length > 0) {
                                    return this.setIn(["title"], title);
                                }
                            }

                            return this;
                        },

                        "getType": function () {
                            return this.getIn(["type"]);
                        },
                        "setType": function (type) {
                            if (_.isString(type)) {
                                type = _.trim(type);
                                if (type.length > 0) {
                                    return this.setIn(["type"], type);
                                }
                            }

                            return this;
                        },

                        "getSuccessMessage": function () {
                            return this.getIn(["successMessage"]);
                        },
                        "setSuccessMessage": function (successMessage) {
                            if (_.isString(successMessage)) {
                                successMessage = _.trim(successMessage);
                                if (successMessage.length > 0) {
                                    return this.setIn(["successMessage"], successMessage);
                                }
                            }

                            return this;
                        },

                        "getViewOnly": function () {
                            return this.getIn(["viewOnly"]);
                        },
                        "setViewOnly": function (viewOnly) {
                            if (_.isString(viewOnly)) {
                                viewOnly = _.trim(viewOnly);
                                if (viewOnly.length > 0) {
                                    return this.setIn(["viewOnly"], viewOnly);
                                }
                            }

                            return this;
                        },

                        "getBusinessProcessFlow": function () {
                            return this.getIn(["businessProcessFlow"]);
                        },
                        "setBusinessProcessFlow": function (businessprocessflow) {
                            if (_.isString(businessprocessflow)) {
                                businessprocessflow = _.trim(businessprocessflow);
                                if (businessprocessflow.length > 0) {
                                    return this.setIn(["businessProcessFlow"], businessprocessflow);
                                }
                            }

                            return this;
                        },

                        "getShowButtonControls": function () {
                            return this.getIn(["showButtonControls"]);
                        },
                        "setShowButtonControls": function (showButtonControls) {
                            if (_.isString(showButtonControls)) {
                                showButtonControls = _.trim(showButtonControls);
                                if (showButtonControls.length > 0) {
                                    return this.setIn(["showButtonControls"], showButtonControls);
                                }
                            }

                            return this;
                        },

                        "getCssPath": function () {
                            return this.getIn(["cssPath"]);
                        },
                        "setCssPath": function (cssPath) {
                            if (_.isString(cssPath)) {
                                cssPath = _.trim(cssPath);
                                if (cssPath.length > 0) {
                                    return this.setIn(["cssPath"], cssPath);
                                }
                            }

                            return this;
                        },

                        "getLayoutColumnsCount": function () {
                            return this.getIn(["layoutColumnsCount"]);
                        },
                        "setLayoutColumnsCount": function (layoutColumnsCount) {
                            if (!_.isUndefined(layoutColumnsCount)) {
                                return this.setIn(["layoutColumnsCount"], layoutColumnsCount);
                            }

                            return this;
                        },

                        "getTransactionId": function () {
                            return this.getIn(["transactionId"]);
                        },
                        "setTransactionId": function (transactionId) {
                            if (!_.isUndefined(transactionId)) {
                                return this.setIn(["transactionId"], transactionId);
                            }

                            return this;
                        },

                        "getPopulateEntityId": function () {
                            return this.getIn(["populateEntityId"]);
                        },
                        "setPopulateEntityId": function (populateEntityId) {
                            if (!_.isUndefined(populateEntityId)) {
                                return this.setIn(["populateEntityId"], populateEntityId);
                            }

                            return this;
                        }
                    }
                },

                Element = {
                    "Base": {
                        "schema": {
                            "type": "DefaultType",
                            "name": "",
                            "label": "",
                            "sqlSeq": "",
                            "cssClass": "",
                            "value": "",
                            "displaySeq": "",
                            "rowNum": ""
                        },

                        "methods": {
                            "revivers": {
                                "Element": function (model) {
                                    let
                                        {type, name, label, sqlSeq, cssClass, required, value, displaySeq, rowNum} = model
                                    return this.setType(type)
                                        .setName(name)
                                        .setLabel(label)
                                        .setSqlSeq(sqlSeq)
                                        .setCssClass(cssClass)
                                        .setValue(value)
                                        .setDisplaySeq(displaySeq)
                                        .setRowNum(rowNum);
                                }
                            },

                            "getType": function () {
                                return this.getIn(["type"]);
                            },
                            "setType": function (type) {
                                if (_.isString(type)) {
                                    type = _.trim(type);
                                    if (type.length > 0) {
                                        return this.setIn(["type"], type);
                                    }
                                }

                                return this;
                            },

                            "getName": function () {
                                return this.getIn(["name"]);
                            },
                            "setName": function (name) {
                                if (_.isString(name)) {
                                    name = _.trim(name);
                                    if (name.length > 0) {
                                        return this.setIn(["name"], name);
                                    }
                                }

                                return this;
                            },

                            "getLabel": function () {
                                return this.getIn(["label"]);
                            },
                            "setLabel": function (label) {
                                if (_.isString(label)) {
                                    label = _.trim(label);
                                    if (label.length > 0) {
                                        return this.setIn(["label"], label);
                                    }
                                }

                                return this;
                            },

                            "getSqlSeq": function () {
                                return this.getIn(["sqlSeq"]);
                            },
                            "setSqlSeq": function (sqlSeqid) {
                                if (!_.isUndefined(sqlSeqid)) {
                                    return this.setIn(["sqlSeq"], sqlSeqid);
                                }

                                return this;
                            },


                            "getCssClass": function () {
                                return this.getIn(["cssClass"]);
                            },
                            "setCssClass": function (cssClass) {
                                if (_.isString(cssClass)) {
                                    cssClass = _.trim(cssClass);
                                    if (cssClass.length > 0) {
                                        return this.setIn(["cssClass"], cssClass);
                                    }
                                }

                                return this;
                            },


                            "getValue": function () {
                                return this.getIn(["value"]);
                            },
                            "setValue": function (value) {
                                if (_.isString(value)) {
                                    value = _.trim(value);
                                    if (value.length > 0) {
                                        return this.setIn(["value"], value);
                                    }
                                }

                                return this;
                            },

                            "getDisplaySeq": function () {
                                return this.getIn(["displaySeq"]);
                            },
                            "setDisplaySeq": function (displaySeq) {
                                if (!_.isUndefined(displaySeq)) {
                                    return this.setIn(["displaySeq"], displaySeq);
                                }

                                return this;
                            },

                            "getRowNum": function () {
                                return this.getIn(["rowNum"]);
                            },
                            "setRowNum": function (rowNum) {
                                if (!_.isUndefined(rowNum)) {
                                    return this.setIn(["rowNum"], rowNum);
                                }

                                return this;
                            }



                        }
                    }
                };

            Element[ElementTypes.TextBox] = _.merge({},
                Element.Base,
                {
                    "schema": {
                        "type": ElementTypes.TextBox,
                        "required": ""
                    },
                    "methods": {
                        "revivers": {
                            "TextBox": function (model) {
                                let {required} = model;
                                return this.setRequired(required);
                            }
                        },
                        "getRequired": function () {
                            return this.getIn(["required"]);
                        },
                        "setRequired": function (required) {
                            if (_.isString(required)) {
                                required = _.trim(required);
                                if (required.length > 0) {
                                    return this.setIn(["required"], required);
                                }
                            }
                            return this;
                        }
                    }
                }
            );

            Element[ElementTypes.DropDown] = _.merge({},
                Element.Base,
                {
                    "schema": {
                        "type": ElementTypes.DropDown,
                        "populateEvent": "",
                        "target": ""
                    },
                    "methods": {
                        "revivers": {
                            "DropDown": function (model) {
                                let {populateEvent, target} = model;
                                return this.setPopulateEvent(populateEvent).setTarget(target);
                            }
                        },

                        "getPopulateEvent": function () {
                            return this.getIn(["populateEvent"]);
                        },
                        "setPopulateEvent": function (populateEvent) {
                            if (_.isString(populateEvent)) {
                                populateEvent = _.trim(populateEvent);
                                if (populateEvent.length > 0) {
                                    return this.setIn(["populateEvent"], populateEvent);
                                }
                            }

                            return this;
                        },
                        "getTarget": function () {
                            return this.getIn(["target"]);
                        },
                        "setTarget": function (target) {
                            if (_.isString(target)) {
                                target = _.trim(target);
                                if (target.length > 0) {
                                    return this.setIn(["target"], target);
                                }
                            }

                            return this;
                        }
                    }
                }
            );

            Element[ElementTypes.Textarea] = _.merge({},
                Element.Base,
                {
                    "schema": {
                        "type": ElementTypes.Textarea
                    }
                }
            );

            let Types = {
                "Form": makeTypedRecord(Model),
                "Element": {
                    [ElementTypes.TextBox]:  makeTypedRecord(Element[ElementTypes.TextBox]),
                    [ElementTypes.DropDown]: makeTypedRecord(Element[ElementTypes.DropDown]),
                    [ElementTypes.Textarea]: makeTypedRecord(Element[ElementTypes.Textarea])
                }
            },

                CreateForm = function (model) {
                    let form = new Types.Form();
                    return processRevivers(form, model);
                },
                CreateEmptyForm = function (model) {
                    return new Types.Form();
                },

                ElementFactory = {
                    ElementTypes,
                    "element": function (type) {
                        return new Types.Element[type]();
                    },
                    "fromModel": function (model) {
                        let {type} = model;
                        //console.log(type);
                        if (!ElementTypes[type]) {
                            throw `Invalid element type - ${type}`;
                        }
                        //console.log(Types.Element[type]);
                        let element = Types.Element[type]();
                        console.log(element);
                        return processRevivers(element, model);
                    }
                };

            return {
                "fromModel": function (model) {
                    return CreateForm(model);
                },
                "createEmptyForm": function () {
                    return CreateEmptyForm();
                },
                ElementFactory
            }

        }

    },

    FormSchemaBuilder = function (schemaVersion = defaultSchemaVersion) {
        return FormSchemaBuilders[schemaVersion]();
    };


module.exports = FormSchemaBuilder;
