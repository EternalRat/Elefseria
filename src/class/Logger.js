module.exports = {

	LEVELS: {
		NORMAL: 1,
		DEBUG: 2,
		ALL: 3	
	},

	level: 0,

	/**
	 * Print the variable type followed by his content
	 * @param {any} variable What you wanna print
	 */
	withType(variable) {
		console.log(typeof(variable), variable);
	},

	error(msg) {

	},

	debug(msg) {

	}
}