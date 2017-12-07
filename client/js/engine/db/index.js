
import firebase from 'firebase';
import Promise from 'bluebird';
import {FirebaseConfig} from '../../../AppSettings.json';
import errorMessages from "helpers/constants/errormessages/persistenceLayer.js"

let db={
    "setup":(database)=>Promise.resolve(firebase.initializeApp(FirebaseConfig))
};
const ValidPattern = new RegExp(/[#$.\[\]\/]/);

let getChildDbRef = (paths) => {
	let dbRef = firebase.database().ref();
	paths.forEach((path) => dbRef = dbRef.child(path));
	return dbRef;
}

let isInvalidPath = (paths) => {
	return paths.some((path) => {
		if (_.isEmpty(path) || ValidPattern.test(path)) {
			return true;
		}
	})
}

let validatePathArr = (paths) => {
	return new Promise((resolve, reject) => {
		if (_.isArray(paths)) {
			isInvalidPath(paths) ? reject(errorMessages.InvalidPathString) : resolve();
		} else {
			reject(errorMessages.InvalidPath);
		}
	})
}

let isNull = (object) => {
	return new Promise((resolve, reject) => {
		_.isNil(object) ? reject(errorMessages.InvalidObject) : resolve();
	})
}

let getOrderDBRef = (dbRef, orderBy, childKey) => {
	switch (orderBy) {
		case "key":
			return dbRef.orderByKey()
			break;
		case "value":
			return dbRef.orderByValue()
			break;
		case "child":
			return dbRef.orderByChild(childKey)
			break;
	}
}

let getLimitsDbRef = (dbRef, limitsConfig) => {
	let {limitToFirst = false, limitToFirstVal, limitToLast = false, limitToLastVal} = limitsConfig;
	if (limitToFirst) {
		return dbRef.limitToFirst(limitToFirstVal);
	}
	if (!limitToFirst && limitToLast) {
		return dbRef.limitToLast(limitToLastVal);
	}
}

let getRangeDbRef = (dbRef, rangeConfig) => {
	let {startAt = false, startAtVal, endAt = false, endAtVal} = rangeConfig;
	if (startAt) {
		return dbRef.startAt(startAtVal);
	}
	if (endAt) {
		return dbRef.endAt(endAtVal);
	}
}

let generateQuery = (dbRef, query) => {
	let {orderBy} = query || { orderBy: false };
	if (orderBy) {
		let {orderBy, childKey, limits = false, range = false, equalTo = false} = query;
		dbRef = getOrderDBRef(dbRef, orderBy, childKey);
		if (limits) {
			dbRef = getLimitsDbRef(dbRef, query.limitsConfig);
		}
		if (!limits && range) {
			dbRef = getRangeDbRef(dbRef, query.rangeConfig);
		}
		if (!range && equalTo) {
			let {equalToVal} = query;
			dbRef = dbRef.equalTo(equalToVal);
		}
	}
	return dbRef;
}

let DbContext = {
	"save": (paths, object) => {
		return validatePathArr(paths)
			.then(() => isNull(object))
			.then(() => getChildDbRef(paths))
			.then((dbRef) => dbRef.set(object))
	},
	"update": (paths, object) => {
		return validatePathArr(paths)
			.then(() => isNull(object))
			.then(() => getChildDbRef(paths))
			.then((dbRef) => dbRef.update(object))
	},
	"delete": (paths) => {
		return validatePathArr(paths)
			.then(() => getChildDbRef(paths))
			.then((dbRef) => dbRef.remove())
	},
	"get": (paths, query) => {
		query = _.isNil(query) ? { orderBy: false } : query._getQuery();
		return validatePathArr(paths)
			.then(() => getChildDbRef(paths))
			.then((dbRef) => generateQuery(dbRef, query))
			.then((dbRef) => dbRef.once('value'))
			.then((snap) => snap.val())
	}
};

module.exports = {DbContext,db};