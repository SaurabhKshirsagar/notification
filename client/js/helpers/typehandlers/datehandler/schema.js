let jsonSchema = {
        type: "date",
        patternValidation: "/^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|99)\d{2}$/",
        defaultValue: null,
        mode: "datetime", //date
       // min: -2177472600,
       min:1479407400000,//17 nov 2016
       max:1480012200000,//25 nov 2016
       // max: 253402194600,
        required: true,
        allowsNull: true,
        formatting: false,
        format:"MM-DD-YYYY"
    };
export default jsonSchema;