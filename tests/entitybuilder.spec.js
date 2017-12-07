let
    im = require("immutable"),
    builder = require("../client/js/helpers/schemaBuilders/entityBuilder")();

let entityDataInstance =
    {
        "Id": "da306b2b-b08f-396f-b2d8-29d2119739f8",
        "Unique": "",
        "Title": "Candidate",
        "Name": "candidate",
        "Description": "Candidate Entity",
        "Version": "1.0",
        "Attributes": {
            "7f94a637-2340-3d3b-575e-a3d59a6fbf14": {
                "Id": "7f94a637-2340-3d3b-575e-a3d59a6fbf14",
                "Title": "_LastModifiedBy",
                "Name": "_LastModifiedBy",
                "Type": "DateTime",
                "Description": "_LastModifiedBy",
                "MaxLength": "",
                "MinLength": "",
                "Required": 1,
                "Volatile": ""
            },
            "5c9d8986-24a8-bfa0-3a1e-ca2952e05e75": {
                "Id": "5c9d8986-24a8-bfa0-3a1e-ca2952e05e75",
                "Title": "_CreatedDate",
                "Name": "_CreatedDate",
                "Type": "DateTime",
                "Description": "_CreatedDate",
                "MaxLength": "",
                "MinLength": "",
                "Required": 1,
                "Volatile": ""
            },
            "62743b51-666e-ace4-cd06-c99e90353851": {
                "Id": "62743b51-666e-ace4-cd06-c99e90353851",
                "Title": "Profile",
                "Name": "profile",
                "Type": "Object",
                "Description": "Candidate Profile",
                "MaxLength": "",
                "MinLength": "",
                "Required": 0,
                "Attributes": {
                    "44023229-b023-ae96-c137-503368183119": {
                        "Id": "62743b51-666e-ace4-cd06-c99e90353851",
                        "Name": "firstName",
                        "Title": "firstName",
                        "Required": 0,
                        "Type": "String",
                        "Description": "",
                        "MinLength": "",
                        "MaxLength": ""
                    }
                },
                "Volatile": ""
            }
        }
    }

let attributeDataInstance =
    {
        "Id": "5c9d8986-24a8-bfa0-3a1e-ca2952e05e75",
        "Title": "Email",
        "Name": "accountemail",
        "Type": "String",
        "Description": "Account Email",
        "MaxLength": "",
        "MinLength": "",
        "Required": true,
        "Volatile": ""
    };
let optionSetDataInstance = {
    "Title": "YesNo",
    "Value": "Yes"
}

describe("Entity schema validations", function () {

    it("Check for appropriate record types schema objects", function () {
        expect(builder.createEmptyEntity).toBeDefined();
        expect(builder.fromModel).toBeDefined();
        expect(builder.AttributeFactory).toBeDefined();
        expect(builder.AttributeFactory.createEmptyAttribute).toBeDefined();
        expect(builder.AttributeFactory.fromModel).toBeDefined();
        expect(builder.OptionSetFactory).toBeDefined();
        expect(builder.OptionSetFactory.createEmptyOptionSet).toBeDefined();
        expect(builder.OptionSetFactory.fromModel).toBeDefined();
    });
});

describe("Entity metadata", function () {
    beforeEach(function () {
        this.entity = builder.createEmptyEntity();
    });

    it("gets and sets id", function () {
        expect(this.entity.setId("007").getId()).toEqual("007");
    });

    it("gets and sets title", function () {
        expect(this.entity.setTitle("James_Bond").getTitle()).toEqual("James_Bond");
    });
});

describe("Attribute metadata", function () {
    beforeEach(function () {
        this.entity = builder.createEmptyEntity();
    });

    it("add an attribute to entity", function () {
        expect(this.entity.getAttributeSize()).toBe(0);
        let attribute = builder.AttributeFactory.createEmptyAttribute('String');
        let newEntity = this.entity.pushAttribute(attribute);
        expect(newEntity.getAttributeSize()).toBe(1);
    });

    it("get an attribute by its id", function () {
        let attribute = builder.AttributeFactory.createEmptyAttribute('String');
        let updatedAttribute = attribute.setId("123456");
        let updatedEntity = this.entity.pushAttribute(updatedAttribute);
        let fetchedAttribute = updatedEntity.getAttributeById("123456");
        expect(fetchedAttribute.getId()).toEqual("123456");
    });

});

describe("OptionSet metadata", function () {
    beforeEach(function () {
        this.choiceAttribute = builder.AttributeFactory.createEmptyAttribute('Choice');
    });

    it("add optionSet to Attribute", function () {
        let optionSetDataInstance = {
            "Title": "YesNo",
            "Value": "Yes"
        }
        expect(this.choiceAttribute.OptionSets.size).toBe(0);
        let updatedAttribute = this.choiceAttribute.pushOptionSet(optionSetDataInstance);
        expect(updatedAttribute.OptionSets.size).toBe(1);
    });

    it("get and set Title for optionSet", function () {
        let optionSet = builder.OptionSetFactory.createEmptyOptionSet();
        expect(optionSet.getTitle()).toEqual("");
        let updatedOptionSet = optionSet.setTitle("YesNo");
        expect(updatedOptionSet.getTitle()).toEqual("YesNo");
    })
});

describe("Can produce record type from given JSON entity object", function () {
    it("returns Entity type record when input is entity type object", function () {
        expect(builder.fromModel(entityDataInstance)).toBeDefined();
    });

    it("returns Attribute type record when input is attribute type object", function () {
        expect(builder.AttributeFactory.fromModel(attributeDataInstance)).toBeDefined();
    });

    it("returns OptionSet type record when input is OptionSet type object", function () {
        expect(builder.OptionSetFactory.fromModel(optionSetDataInstance)).toBeDefined();
    });
});


describe("Json conversions", function () {
    it("can produce JSON model for empty entity", function () {
        let entity = builder.createEmptyEntity(),
            json = entity.toJSON();
        expect(json).toBeDefined();
    });

    it("can produce valid JSON object from entity type record",function () {
        let entityRecord = builder.fromModel(entityDataInstance);
        let entityJSON = entityRecord.toJSON();
        expect(entityJSON).not.toBeNull();
    });

    it("can produce valid JSON object from attribute type record",function () {
        let attributeRecord = builder.AttributeFactory.fromModel(attributeDataInstance);
        let attributeJSON = attributeRecord.toJSON();
        expect(attributeJSON).not.toBeNull();
    });

    it("can produce valid JSON object from optionset type record",function () {
        let optionSetRecord = builder.OptionSetFactory.fromModel(optionSetDataInstance);
        let optionSetJSON = optionSetRecord.toJSON();
        expect(optionSetJSON).not.toBeNull();
    });
});