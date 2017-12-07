import {Component} from 'react';
import pathComponent from 'components/pathcomponent';
import lazyComponent from 'components/lazycomponent';
import getComponent from "helpers/getcomponent";
import checkAssetPreconditions from "helpers/checkassetpreconditions";
import processAssetComponentProps from "helpers/processassetcomponentprops";
import processChildren from "helpers/processchildren";

export default pathComponent(
	lazyComponent(checkAssetPreconditions, processAssetComponentProps, getComponent, processChildren)
);

