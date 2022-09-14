import React from 'react'

const TableEntry = (props) => {
	
		return (
            <tr>
                <td>{props.username}</td>
                <td>{props.password}</td>
            </tr>	
		)
}

export default TableEntry;