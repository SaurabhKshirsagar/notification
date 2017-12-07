import Reflux from 'reflux';
import RefluxPromise from 'reflux-promise';
import bluebird from 'bluebird';
Reflux.use(RefluxPromise(bluebird));

let EntityActions = Reflux.createActions({
                    "fetchEntitySchema":{asyncResult:true},
                    "createEntitySchema":{asyncResult:true},
                    "updateEntitySchema":{asyncResult:true},
                    "deleteEntitySchema":{asyncResult:true},
                    "createFieldSchema":{asyncResult:true},
                    "updateEntityFieldSchema":{asyncResult:true},
                    "deleteEntityFieldSchema" :{asyncResult:true}                 
});


// let EntityActions = Reflux.createActions([
//                     "fetchEntitySchema",
//                     "createEntitySchema",
//                     "updateEntitySchema",
//                     "deleteEntitySchema",
//                     "createFieldSchema",
//                     "updateEntityFieldSchema",
//                     "deleteEntityFieldSchema"                
// ]);

export default EntityActions;