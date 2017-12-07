import R from 'ramda';
import hasParams from 'helpers/hasparams';
import hasPathParams from "helpers/haspathparams";
import hasOwnScope from 'helpers/hasownscope';
import hasVars from "helpers/hasvars";
import mountVars from "helpers/mountvars";
import processLoadActions from 'helpers/processloadactions';
import setupPathParams from 'helpers/setuppathparams';
import mountOwnContextOnParent from 'helpers/mountowncontextonparent';
import asPromise from 'helpers/aspromise';
import fetchRefAssetIfDefined from "helpers/fetchrefassetifdefined";
import setParent from "helpers/setparent";
import ensureId from "helpers/ensureid";
import stripPath from "helpers/strippath";
import processInputParams from "helpers/processinputparams";
import mountParams from "helpers/mountparams";
import evaluateChildExpression from "helpers/evaluatechildexpression";
import childrenIsNonArray from "helpers/childrenisnonarray";

// asset component props processer
let dumpProps=R.curry((message,inProps)=>{console.log(message); console.log(inProps); return inProps;});
let processAssetComponentProps = R.composeP(processLoadActions,
				asPromise(dumpProps("Props after Params mount")),
				R.when(childrenIsNonArray, evaluateChildExpression),
				R.when(hasVars, mountVars),
				asPromise(dumpProps("Props after Params mount")),
				R.when(hasParams, mountParams),
				asPromise(dumpProps("Props before Params mount")),
				R.when(hasPathParams, R.compose(stripPath, setupPathParams)),
				asPromise(dumpProps("Props before Params mount")),
				R.when(hasOwnScope, mountOwnContextOnParent),
				asPromise(dumpProps("Props before Params mount")),
				R.when(hasParams, processInputParams),
				asPromise(dumpProps("Props before processInputParams mount")),
				asPromise(R.compose(setParent, R.when(hasOwnScope, ensureId))), fetchRefAssetIfDefined);
export default processAssetComponentProps;


