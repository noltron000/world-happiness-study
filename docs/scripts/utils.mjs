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

export {loadJSON}
