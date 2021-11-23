var tab = new Array();

/**
 * Add an user into the tab
 * @param {String} id 
 */
function addTab(id) {
    tab.push(id);
}
/**
 * Clear tab
 */
function removeTab() {
    tab = [];
}
/**
 * Get the user at the <i> position
 * @param {Number} i 
 */
function getUser(i) {
    return tab[i];
}
/**
 * @returns Number of people
 */
function getLength() {
    return tab.length;
}

module.exports = {addTab, removeTab, getUser, getLength}