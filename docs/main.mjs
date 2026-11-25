import {buildTable} from './scripts/table.mjs'

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
	const elTable = buildTable(columns, data, 'All Countries', {
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
		const elTable = buildTable(columns, data, category, {
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
