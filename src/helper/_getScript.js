/**
 * Helper für Ajax requests
 *
 * @author Rico Dang <rd@xport.de>, Florian Voigtländer <fv@xport.de>
 * @since  29.04.2021
 *
 * @param {string}   url      URL
 * @param {function} callback Callback Funktion - DEPRECATED
 * @private
 */
const _getScript = function(url, callback)
{
	return new Promise((resolve, reject) =>
	{
		const method = 'GET'
		const request = new XMLHttpRequest()
		request.open(method, url)
		request.responseType = 'text'

		request.addEventListener('load', async function()
		{
			if (this.status >= 200 && this.status < 400) {
				typeof(callback) == 'function' && callback(this.status, url, 'js')
				resolve(this.status, url, 'js')
			}
		})

		request.addEventListener('error', function()
		{
			typeof(callback) == 'function' && callback('Something went wrong!')
			reject(new Error(request.statusText))
		})

		request.send()
	})
}
