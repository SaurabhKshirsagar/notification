import Reflux from 'reflux';
import RefluxPromise from 'reflux-promise';
import bluebird from 'bluebird';
Reflux.use(RefluxPromise(bluebird));

//var FormAction = Reflux.createActions(['ShowForm','CloseForm','Action1','Action2','Action3']);

var GridAction = Reflux.createActions( [{'ShowForm': {  asyncResult: true }},
                                       {'CloseForm': {  asyncResult: true }},
                                       {'SaveForm': {  asyncResult: true }},
                                       {'DeleteEntity': {  asyncResult: true }},
                                       {'Action3': {  asyncResult: true }}
                                       ]);

module.exports = GridAction;