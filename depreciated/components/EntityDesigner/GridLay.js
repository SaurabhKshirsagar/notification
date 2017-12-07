import React from 'react';
import Reflux from 'reflux';
//Vendor Components
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';


let GridLay = React.createClass({
        render: function () {
                let selectRowProp = {
                        mode: "radio",
                        clickToSelect: true,
                        className: 'selected',
                        onSelect: this.props.onSelect
                };
                let options = {
                        paginationSize: 5,
                        paginationShowsTotal: false,
                        sizePerPage: 20
                };
                return (
                        <BootstrapTable
                                data={this.props.entities}
                                pagination={true}
                                search={true}
                                selectRow={selectRowProp}
                                options={options}>
                                <TableHeaderColumn dataField="Name" isKey={true}>Name</TableHeaderColumn>
                                <TableHeaderColumn dataField="Name">Schema Name</TableHeaderColumn>
                                <TableHeaderColumn dataField="Title">Title</TableHeaderColumn>
                        </BootstrapTable>
                );
        }
});

export default GridLay