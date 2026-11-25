// Got json loader from the following source:
// https://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
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

// Learned to apply optional parameters from these sources:
// https://simonsmith.io/destructuring-objects-as-function-parameters-in-es6
// https://stackoverflow.com/questions/11796093/is-there-a-way-to-provide-named-parameters-in-a-function-call-in-javascript
const populateEls = ({
	yearText = '',
	numCountriesText = '',
} = {}) => {
	const elYear = document.getElementById('data-year')
	const elNumCountries = document.getElementById('data-num-countries')
	elYear.textContent = yearText
	elNumCountries.textContent = numCountriesText
}

const createOverallHappinessTable = (data) => {
	// Get the section element.
	const elSection = document.getElementById('all-countries')

	// Create a list of unique categories.
	const columns = [...getUniqueCategories(data)]

	// Create the table, sorted by overall rank by default, and insert it.
	const elTable = createTable(columns, data, 'All Countries')
	elTable.id = 'overall-happiness-table'
	elSection.appendChild(elTable)
}

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
			limit: 10,
		})
		const baseId = category.toLowerCase().replace(/\s+/g, '-')
		elTable.id = `${baseId}-table`
		elSection.appendChild(elTable)
	})
}

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

// Data is the data list from json.
// Categories is an array.
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

// Entry is a dictionary item.
// Categories is an array.
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

// Returns a set of unique countries.
const getUniqueCountries = (data) => {
	// Start by initializing aforementioned set.
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

// Returns a set of unique categories.
const getUniqueCategories = (data) => {
	// Start by initializing aforementioned set.
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

// testing HappinessStudy
StudyHappiness('2019')
