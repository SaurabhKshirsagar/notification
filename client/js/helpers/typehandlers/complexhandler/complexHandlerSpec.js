 import typehandlers from "helpers/typehandlers";
 import {getTypeHandler} from "helpers/createhandler";

let testComplexSchema = {
        type:"complex",
        defaultValue:null,
        name:"vacation",
        attributes:[
                {
                     type:"string",
                     name:"vacationId",
                     defaultValue:null,
                     maxLength:25,
                     minLength:10,
                     required:true
                     
                },
                 {
                     type:"string",
                     name:"employeeId",
                     defaultValue:null,
                     maxLength:25,
                     minLength:10,
                     required:true
                     
                },
                 {
                     type:"string",
                     name:"employeeName",
                     defaultValue:null,
                     maxLength:25,
                     minLength:10,
                     required:true
                     
                },
                 {
                     type:"complex",
                     name:"approver",
                     defaultValue:null,
                     required:true,
                     attributes:[
                             {
                                     type:"string",
                                     name:"name",
                                     required:true,
                                     minLength:6,
                                     maxLength:100
                             },
                              {
                                     type:"string",
                                     name:"id",
                                     required:true,
                                     minLength:6,
                                     maxLength:100
                             },
                              {
                                     type:"string",
                                     name:"department",
                                     required:true,
                                     minLength:6,
                                     maxLength:100
                             }
                     ]
                     
                },
                 {
                     type:"string",
                     name:"vacationId",
                     defaultValue:null,
                     maxLength:25,
                     minLength:10,
                     required:true
                     
                }
        ]
        
};

let testValue = {
        vacationId:"25",
        employeeId:"12546",
        approver:{
             name:"kelvien",
             id:2777
        }
}

export default function runTestData(){
        let handler = getTypeHandler(testComplexSchema.name,testComplexSchema);
        let fVAlue = handler.fromValue(testValue,testComplexSchema);
        let toString = handler.toString(fVAlue);
        let clone  = handler.clone(fVAlue);
}