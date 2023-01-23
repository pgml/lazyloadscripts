/**
 * NOTICE OF LICENSE
 *
 * Copyright (c) 2020 Rico Dang. All rights reserved.
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 *
 * @author     Rico Dang <rico@pgml.de>
 * @copyright  2022 Rico Dang
 * @version    0.1.0
 * @since      07/06/2022
 */

class lazyLoadScripts
{
	constructor(elem, options)
	{
		this.opts = Object.assign({
			offset: 0,
			onWatch: function() {},
			onSuccess: function() {},
			onAllDone: function() {},
			onFail: function(error) {}
		}, options)

		this.nbrScripts = 0
		this.nbrStyles  = 0

		if (typeof elem === 'string')
			this.elem = document.querySelectorAll(elem)

		if (!elem.length)
			this.elem = [elem]

		const elems = []

		this.elem.forEach((el, index) =>
		{
			if (el.dataset.lazyLoadScripts)
			{
				let scripts = _isJSON(el.dataset.lazyLoadScripts)
					? JSON.parse(el.dataset.lazyLoadScripts)
					: [el.dataset.lazyLoadScripts]

				let css = el.dataset.lazyLoadCss || false

				if (_isJSON(css))
					css = JSON.parse(css)
				else {
					if (css !== false)
						css = [css]
				}

				elems[index] = {
					elem: el,
					inDom: false,
					scriptSrc: scripts,
					cssSrc: css
				}
			}
		})

		this.opts.onWatch.call(elems)

		window.addEventListener('scroll', () =>
		{
			let scripts = null

			elems.forEach((el, index) =>
			{
				if (!el.inDom && this.isInViewport(el.elem))
				{
					this.opts.onWatch(elems)

					if (el.cssSrc !== false)
						el.cssSrc.map(src => this.appendCSS(src))
					scripts = el.scriptSrc.map(src => this.appendJS(src, this.opts.onSuccess))

					elems[index].inDom = true
					el.elem.removeAttribute('data-lazy-load-css')
					el.elem.removeAttribute('data-lazy-load-scripts')
				}
			})

			if (scripts)
			{
				// Fake it until you make it
				setTimeout(() => {
					Promise.all(scripts)
						.then(this.opts.onAllDone(this.appendJS))
				}, 100)
			}
		})
	}

	/**
	 * @see https://vanillajstoolkit.com/helpers/isinviewport/
	 *
	 * @param {HTMLElement} elem
	 * @returns
	 */
	isInViewport(elem)
	{
		if (window.getComputedStyle(elem).visibility === 'hidden')
			return

		const rect      = elem.getBoundingClientRect()
		    , winWidth  = window.innerWidth || document.documentElement.clientWidth
		    , winHeight = window.innerHeight || document.documentElement.clientHeight
		    , elHeight  = elem.offsetHeight
		    , elWidth   = elem.offsetWidth

		return rect.top >= -elHeight
			&& rect.left >= -elWidth
			&& rect.right <= winWidth + elWidth
			&& rect.bottom - this.opts.offset <= winHeight + elHeight
	}

	/**
	 * appends style or script to dom
	 *
	 * @param {string} url - style or script url
	 * @param {function} callback
	 */
	appendCSS(url, callback)
	{
		const el = document.createElement('link');
		el.href = url
		el.rel = 'stylesheet'
		el.type = 'text/css'
		el.onload = typeof callback == 'function' ? callback(200, url, 'css') : callback;

		document.body.appendChild(el);
	}

	/**
	 * appends style or script to dom
	 *
	 * @param {string} url - style or script url
	 * @param {function} callback
	 */
	appendJS(url, callback)
	{
		let url_exists = false

		document.querySelectorAll('script').forEach(script => {
			if (script.src == url) {
				url_exists = true;
				return
			}
		})

		if (url_exists)
			return false

		return new Promise(resolve =>
		{
			const el = document.createElement('script');
			el.src = url
			el.type = 'text/javascript'
			el.onload = typeof callback == 'function' ? callback(200, url, 'js') : callback;

			document.body.appendChild(el);

			resolve(200, url, 'js');
		})
	}
}
