/**
 * Helper für Ajax requests
 *
 * @author Rico Dang <rd@xport.de>
 * @since  27.06.2022
 *
 * @param {string} item - string to check
 * @private
 */

const _isJSON = function(item)
{
	item = typeof item !== 'string'
		? JSON.stringify(item)
		: item;

	try {
		item = JSON.parse(item);
	} catch (e) {
		return false;
	}

	if (typeof item === 'object' && item !== null)
		return true;
	return false;
}
