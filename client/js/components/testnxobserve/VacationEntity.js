import observer from '@risingstack/nx-observe';


let vacationEntity=observer.observable({
    "empId":"101",
    "startDate":"",
    "endDate":"",
    "halfDay":false,
    "approvedStatus":"",
    "approver":"",
    "quota":"",
    "reason":""
});


let controlTypes={
    "empId":"text",  
    "startDate":"date",  
    "endDate":"",
    "halfDay":"checkbox",
    "quota":"text",
    "reason":"text",
    "approver":"text",    
    "approvedStatus":"text"
};


module.exports={vacationEntity,controlTypes};