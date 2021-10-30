import React, { Component } from 'react';
import DataTable from 'react-data-table-component';
const customStyles = {
    rows: {
        style: {
            minHeight: '72px',
            fontSize: '16px' // override the row height
        },
    },
    headCells: {
        style: {
            paddingLeft: '8px', // override the cell padding for head cells
            paddingRight: '8px',
            fontWeight: 'bold',
            fontSize: '18px'
        },
    },
    cells: {
        style: {
            paddingLeft: '8px', // override the cell padding for data cells
            paddingRight: '8px',
        },
    },
};

const FilterComponent = ({ filterText, onFilter, onClear }) => (
	<>
        <div class="input-group mb-2 mr-sm-2" style={{ width: '250px' }}>
            <input 
                id="search"
                type="text"
                className="form-control"
                placeholder="Filter By Name"
                aria-label="Search Input"
                value={filterText}
                onChange={onFilter}
                
            />
            <div class="input-group-append">
                <div class="input-group-text" onClick={onClear}> <i className="fas fa-times"></i> </div>
            </div>
        </div>
	</>
);

const columns = [
	{
		name: 'Name',
		selector: row => row.name,
		sortable: true,
	},
	{
		name: 'Email',
		selector: row => row.email,
		sortable: true,
	},
	{
		name: 'Address',
		selector: row => row.address,
		sortable: true,
	},
];




function Datatables (props) {
    const [filterText, setFilterText] = React.useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
	const filteredItems = props.data.filter(
		item => props.filter && item[props.filter] ?  item[props.filter].toLowerCase().includes(filterText.toLowerCase()) : item,
	);

	const subHeaderComponentMemo = React.useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

		return (
			<FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
		);
	}, [filterText, resetPaginationToggle]);

    return (
            <DataTable
                columns={props.columns}
                data={filteredItems}
                pagination
                paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
                subHeader={props.filter ? true : false}
                subHeaderComponent={props.filter ? subHeaderComponentMemo : ''}
                persistTableHead
                customStyles={customStyles}
                highlightOnHover
		        pointerOnHover
                progressPending={props.pending}
            />
        );
}


export default Datatables;