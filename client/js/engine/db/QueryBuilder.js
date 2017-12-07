import _ from 'lodash';

let QueryBuilder = {
        "_query" : {},    
        "_getQuery" : function (){
            return this._query;
        },
        "new" : function() {
            this._query = {};
            return this;
        },
        "equalTo" :  function (equalToVal) {
            this._query = _.merge(this._query,{equalTo:true,equalToVal:equalToVal});
            return this;
        },
        "orderByOption": {key:"key",child:"child",value:"value" },
        "orderBy" :  function (orderBy) {
            this._query = _.merge(this._query, {orderBy:orderBy});
            return this;
        },
        "childKey" :  function (childKey) {
            this._query = _.merge(this._query, {childKey:childKey});
            return this;
        },
        "limitToFirst" :  function (limitToFirstVal) {
            this._query = _.merge(this._query, {limits      :   true,
                                                limitsConfig:   {limitToFirst: true,limitToFirstVal:limitToFirstVal,}
                                                });
            return this;
        },
        "limitToLast" :  function (limitToLastVal) {
            this._query = _.merge(this._query, {limits      :   true,
                                                limitsConfig:   {limitToLast: true,limitToLastVal:limitToLastVal,}
                                                });
            return this;
        },
        "startAt" : function (startAtVal) {
            this._query = _.merge(this._query, {range       :   true,
                                                rangeConfig :   { startAt : true, startAtVal : startAtVal,}
                                                });
            return this;
        },
        "endAt" : function (endAtVal) {
            this._query = _.merge(this._query, {range       :   true,
                                                rangeConfig :   { endAt : true, endAtVal : endAtVal}
                                                });
            return this;
        }
};

module.exports = QueryBuilder;