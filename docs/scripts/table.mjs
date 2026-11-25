/**
 * Create a complete table with caption and header/body.
 * @param {array} columns - Array of column names (including 'Overall rank' if sorting by it)
 * @param {array} data - Array of data objects
 * @param {string} caption - Table caption text
 * @param {object} options - Table configuration options
 * @returns {HTMLElement} table element
 */
const buildTable = (
	columns,
	data,
	caption,
	{
		hiddenColumns = [],
		limit = Infinity,
		sortColumn = 'Overall rank',
		sortMethod = (a, b) => (a - b),
	},
) => {
	// Build comparator from sortColumn and sortMethod
	const sortComparator = (a, b) => {
		const aVal = a[sortColumn]
		const bVal = b[sortColumn]
		return sortMethod(aVal, bVal)
	}

	// Sort the data using the comparator.
	const rows = [...data].sort(sortComparator)
	const limitedRows = rows.slice(0, limit)

	// Create the table and caption elements.
	const elTable = document.createElement('table')
	const elCaption = document.createElement('caption')

	// Fill in the rest of the table.
	const visibleColumns = columns.filter(column => !hiddenColumns.includes(column))
	const elTableHead = buildTableHead(visibleColumns)
	const elTableBody = buildTableBody(visibleColumns, limitedRows)

	// Add items to the table.
	elCaption.textContent = caption
	elTable.appendChild(elCaption)
	elTable.appendChild(elTableHead)
	elTable.appendChild(elTableBody)
	return elTable
}

/**
 * Create table header with column names.
 * @param {array} categories - Array of column names
 * @returns {HTMLElement} thead element
 */
const buildTableHead = (categories) => {
	// Entry is a dictionary item.
	// Categories is an array.
	const elTableHead = document.createElement('thead')
	const elTableRow = document.createElement('tr')
	categories.forEach((category) => {
		// Create element.
		const elTableEntry = document.createElement('th')
		// Add text content to element.
		console.log(category)
		elTableEntry.textContent = String(category)
		// Append data as child to table row.
		elTableRow.appendChild(elTableEntry)
	})
	// the table row is full; use it in the head.
	elTableHead.appendChild(elTableRow)
	// the head is complete; return it.
	return elTableHead
}

/**
 * Create table body with all rows.
 * @param {array} categories - Array of column names
 * @param {array} data - Array of data objects
 * @returns {HTMLElement} tbody element
 */
const buildTableBody = (categories, data) => {
	// Create the empty body.
	const elTableBody = document.createElement('tbody')
	// Add each entry as a row to the body.
	data.forEach((entry) => {
		// Create a fully populated table-row element.
		// This uses another helper function.
		const elTableRow = buildTableRow(entry, categories)
		// Append row as child to table body.
		elTableBody.appendChild(elTableRow)
	})
	// the body is complete; return it.
	return elTableBody
}

/**
 * Create a single table row.
 * @param {object} entry - Data object for the row
 * @param {array} categories - Array of column names
 * @returns {HTMLElement} tr element
 */
const buildTableRow = (entry, categories) => {
	const elTableRow = document.createElement('tr')
	categories.forEach((category) => {
		// Create element.
		const elTableData = document.createElement('td')
		// Add text content to element.
		let text = ''
		if (category in entry) {
			text = `${entry[category]}`
		}
		elTableData.textContent = text
		// Append data as child to table row.
		elTableRow.appendChild(elTableData)
	})
	// the table row is full; return it.
	return elTableRow
}

export {buildTable}
