import React from 'react';
import Table from './Table';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import Row from './Row';
import Column from './Column';
import _ from 'lodash';

class TableA extends React.Component {

	render() {

		const {data, columns} = this.props;

		return (
			<Table className="table table-sm table-bordered">
				<TableHeader>
					<Row>
						{columns.map((column,i) => (<Column key={i}>{column.label}</Column>))}
					</Row>
				</TableHeader>
				<TableBody>
					{data.map((item, i) => {
						return (
							<Row key={i}>
								{columns.map((column, i) => {

									let c;
									if(typeof column.render === "function") {
										c = column.render(item);
									} else {
										c = _.get(item, column.accessor);
									}

									return (<Column key={i}>{c}</Column>)
								})}
							</Row>
						)
					})}
				</TableBody>
			</Table>
		)
	}
}

export default  TableA