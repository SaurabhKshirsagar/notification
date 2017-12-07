import Reflux from 'reflux';
import RefluxPromise from 'reflux-promise';
import bluebird from 'bluebird';
Reflux.use(RefluxPromise(bluebird));

var Action = Reflux.createActions( [{
    'OpenModule': {  asyncResult: true },
    'openForm':{asyncResult:true},
    'getGeolocation':{asyncResult:true}
}]);

module.exports = Action;