let chalk = require('chalk')

let handleError = (error, request) => {
	console.error(chalk.bold(request.method, request.url))
	console.error(chalk.red(error))

	response.writeHead(500)
	response.end(error.toString())
}

module.exports = function(route, request, response) {
	// Execute handler
	if(this.modifiers.length === 0) {
		try {
			route(request, response)
		} catch(error) {
			handleError(error, request)
		}
	} else {
		let generateNext = index => {
			if(index === this.modifiers.length)
				return route.bind(undefined, request, response)

			return this.modifiers[index].bind(undefined, request, response, generateNext(index + 1))
		}

		try {
			generateNext(0)()
		} catch(error) {
			handleError(error, request)
		}
	}
}