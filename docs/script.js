/**
 * Load JSON file using XMLHttpRequest.
 * https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
 * @param {string} path - Path to JSON file
 * @param {function} callback - Callback function with JSON string
 */
const loadJSON = (path, callback) => {
	const xobj = new XMLHttpRequest()
	xobj.overrideMimeType('application/json')
	xobj.open('GET', path, true)
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == '200') {
			// Required use of an anonymous callback as
			// .open will NOT return a value but simply
			// returns undefined in asynchronous mode.
			callback(xobj.responseText)
		}
	}
	xobj.send(null)
}

/**
 * Populate DOM elements with data.
 * @param {object} params - Object containing yearText and numCountriesText
 */
const populateEls = ({
	yearText = '',
	numCountriesText = '',
} = {}) => {
	const elYear = document.getElementById('data-year')
	const elNumCountries = document.getElementById('data-num-countries')
	elYear.textContent = yearText
	elNumCountries.textContent = numCountriesText
}

/**
 * Create the main overall happiness table with all countries.
 * @param {array} data - Array of country data objects
 */
const createOverallHappinessTable = (data) => {
	// Get the section element.
	const elSection = document.getElementById('all-countries')

	// Create a list of unique categories.
	const columns = [...getUniqueCategories(data)]

	// Create the table, sorted by overall rank by default, and insert it.
	const elTable = createTable(columns, data, 'All Countries', {
		sortColumn: 'Overall rank',
		sortMethod: (a, b) => a - b,
	})
	elTable.id = 'overall-happiness-table'
	elSection.appendChild(elTable)
}

/**
 * Create tables for top 10 countries by various categories.
 * @param {array} data - Array of country data objects
 */
const createTopTenTables = (data) => {
	// Get the section element.
	const elSection = document.getElementById('top-countries')

	// Determine catagories to rank countries by.
	const categories = [
		'GDP per capita',
		'Social support',
		'Healthy life expectancy',
		'Generosity',
	]

	categories.forEach((category) => {
		// Select the columns for this category.
		const columns = ['Country or region', category]

		// Create the table with the top ten scores and insert it into the section.
		const elTable = createTable(columns, data, category, {
			sortColumn: category,
			sortMethod: (a, b) => (b - a),
			limit: 10,
		})
		const baseId = category.toLowerCase().replace(/\s+/g, '-')
		elTable.id = `${baseId}-table`
		elSection.appendChild(elTable)
	})
}

/**
 * Create a complete table with caption and header/body.
 * @param {array} columns - Array of column names (including 'Overall rank' if sorting by it)
 * @param {array} data - Array of data objects
 * @param {string} caption - Table caption text
 * @param {object} options - Table configuration options
 * @returns {HTMLElement} table element
 */
const createTable = (
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
	const elTableHead = createTableHead(visibleColumns)
	const elTableBody = createTableBody(visibleColumns, limitedRows)

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
const createTableHead = (categories) => {
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
const createTableBody = (categories, data) => {
	// Create the empty body.
	const elTableBody = document.createElement('tbody')
	// Add each entry as a row to the body.
	data.forEach((entry) => {
		// Create a fully populated table-row element.
		// This uses another helper function.
		const elTableRow = createTableRow(entry, categories)
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
const createTableRow = (entry, categories) => {
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


/**
 * Get unique countries from data.
 * @param {array} data - Array of country data objects
 * @returns {Set} Set of unique country names
 */
const getUniqueCountries = (data) => {
	const countries = new Set()
	// Reducer gets ran recursively for each entry
	// in the data array, which is called with reduce.
	const reducer = (accumulator, entry) => {
		accumulator.add(entry['Country or region'])
		return accumulator
	}
	// Countries is the default start-value for the
	// accumulator, which gets modified/filled.
	data.reduce(reducer, countries)
	return countries
}

/**
 * Get unique categories from data.
 * @param {array} data - Array of country data objects
 * @returns {Set} Set of unique category keys
 */
const getUniqueCategories = (data) => {
	const categories = new Set()
	// Reducer gets ran recursively for each entry
	// in the data array, which is called with reduce.
	const reducer = (accumulator, entry) => {
		// We need to ensure every key is covered here.
		for (const category in entry) {
			accumulator.add(category)
		}
		return accumulator
	}
	// Categories is the default start-value for the
	// accumulator, which gets modified/filled.
	data.reduce(reducer, categories)
	return categories
}

/**
 * Load and process happiness data for a specific year.
 * @param {string} year - Year to load data for (e.g., '2019')
 */
const StudyHappiness = (year) => {
	// Find file from input year.
	const file = `./data/${year}.json`

	loadJSON(file, (response) => {
		// Parse JSON string into object.
		const data = JSON.parse(response)

		// Gather data from helper functions.
		const countries = getUniqueCountries(data)

		// Populate elements from earlier construction.
		populateEls({
			'yearText': year,
			'numCountriesText': countries.size,
		})

		createTopTenTables(data)
		createOverallHappinessTable(data)
	})
}

// Run the application when the page loads.
StudyHappiness('2019')
