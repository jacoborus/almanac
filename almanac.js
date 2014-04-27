(function () {
'use strict';

var isNode, isElement, isDOM, startsWithNumber, checkClasses, setClasses, isArray, validMonthNames, addCSS, Header;

//Returns true if it is a DOM node
isNode = function (o){
	return (
		typeof Node === 'object' ? o instanceof Node :
		o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName==='string'
	);
};

//Returns true if it is a DOM element
isElement = function (o){
	return (
		typeof HTMLElement === 'object' ? o instanceof HTMLElement : //DOM2
		o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName==='string'
	);
};

isDOM = function (o) {
	return (isNode( o ) || isElement( o ));
};

startsWithNumber = function (text) {
	if (Number(text[0])) {
		return true;
	} else {
		return false;
	}
};

checkClasses = function (classes) {
	var l = classes.split(' '), i;
	for (i in l) {
		if (startsWithNumber( l[i] )) {
			return true;
		}
	}
	return false;
};

setClasses = function () {
	var l = this.settings.classes.split(' '), i;
	for (i in l) {
		if (this.el.classList) {
			this.el.classList.add( l[i] );
		} else {
			this.el.className += ' ' + l[i];
		}
	}
};

isArray = function (fn) {
	return fn && {}.toString.call( fn ) === '[object Array]';
};

validMonthNames = function () {
	var l = this.settings.monthNames, i;
	for (i in l) {
		if (typeof l[i] !== 'string') {
			return false;
		}
	}
	return true;
};

// inject css in html header
addCSS = function () {
	var s = document.getElementById('almanac-style'),
		createStyle = 'almanac *{text-align:center;box-sizing:border-box;transition:all .3s}';

	if (s === null) {
		s = document.createElement( 'style' );
		s.type = 'text/css';
		s.setAttribute( 'id', 'almanac-style');
		document.getElementsByTagName('head')[0].appendChild( s );
		if (s.styleSheet) {   // IE
			s.styleSheet.cssText = createStyle;
		} else {              // the world
			s.appendChild(document.createTextNode( createStyle ));
		}
	}
};




Header = function (alma) {

	var header, left, right;

	left  = this.left = document.createElement( 'a' );
	left.innerHTML = '&lt;';
	left.setAttribute( 'class', 'floatleft');
	left.onclick = function () {
		alma.prev();
	};
	right = this.right = document.createElement( 'a' );
	right.setAttribute( 'class', 'floatright');
	right.innerHTML = '&gt;';
	right.onclick = function () {
		alma.next();
	};
	header = this.header = document.createElement( 'header' );
	header.appendChild( left );
	header.appendChild( right );
	this.el = header;
};





/**
 * Create an almanac in/at `target` with passed options.
 *
 * Example:
 * ```js
 * // get a HTML element
 * var elem = document.getElementById( 'almanac' );
 *
 * // or create one and insert when you want
 * // var elem = document.createElement( 'div' );
 *
 * // then create a calendar
 * var cal = new Almanac( elem, {
 * 	multi: true,
 * 	showMonths: 2
 * });
 * ```
 *
 * #### `options`:
 *
 * - **`name`**: Sets `name` as input name
 * - **`multi`**: Sets single (input[type="radio"]) or multiple (input[type="checkbox"]) day selection.
 * - **`showMonths`**: Months to show in calendar at once
 * - **`id`**: Set `id` as almanac element id
 * - **`classes`**: Add `classes` to almanac element. Separated by spaces
 * - **`monthNames`**: List of month names. English names by default
 * - **`firstDay`**: A day from first month to show in almanac
 * - **`hideHeader`**: Don't show almanac header
 *
 * @param {HTML element} target  Element to replace, or embed in the almanac
 * @param {Object} options
 */
var Almanac = function (target, options) {
	// check arguments
	if (!target) {
		throw new Error( 'Missing target argument creating Almanac' );
	}
	if (!isDOM( target )) {
		throw new Error( 'Target has to be a DOM element' );
	}
	if (options && typeof options !== 'object') {
		throw new Error( 'options has to be a object' );
	}
	this.el = target;
	var opts = this.settings = options || {};
	opts.name = opts.name || this.el.getAttribute('name') || false;

	// throw error on bad name property
	if (!opts.name) {
		throw new Error( 'Almanac element needs a name' );
	}
	this.el.setAttribute( 'name', opts.name );

	// set multi from options or by default
	opts.multi = opts.multi || false;

	// set showMonths
	opts.showMonths = opts.showMonths || 1;
	// throw error on bad showMonths property
	if (typeof opts.showMonths !== 'number' || opts.showMonths < 1 || (opts.showMonths % 1) !== 0) {
		throw new Error( 'Invalid monthName property' );
	}

	// check for valid id property
	opts.id = opts.id || this.el.getAttribute('id') || false;
	if (opts.id) {
		if (typeof opts.id !== 'string' || startsWithNumber( opts.id )) {
			throw new Error( 'Invalid id property' );
		}
	}
	// set id
	this.el.setAttribute( 'id', opts.id );

	// classes
	if (opts.classes) {
		// check for valid classes
		if (typeof opts.classes !== 'string' || checkClasses( opts.classes )) {
			throw new Error( 'Invalid classes property' );
		}
		// add classes
		setClasses.call( this );
	}

	// monthNames by default
	opts.monthNames = opts.monthNames || ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	// check monthNames
	if (!isArray( opts.monthNames ) || !validMonthNames.call( this, opts.monthNames ) || opts.monthNames.length !== 12) {
		throw new Error( 'Invalid monthNames property' );
	}

	// set firstDay property
	opts.firstDay = opts.firstDay || new Date();
	// check valid date
	if (Object.prototype.toString.call( opts.firstDay ) !== '[object Date]') {
		throw new Error( 'Invalid firstDay property' );
	}

	// hideHeader
	opts.hideHeader = opts.hideHeader || false;

	this.dates = {};
	this.cursor = 0;

	addCSS();

	// add header
	if (!opts.hideHeader) {
		this.header = new Header( this );
		this.el.appendChild( this.header.el );
	}
};



Almanac.prototype.next = function () {
	this.cursor++;
};

Almanac.prototype.prev = function () {
	this.cursor--;
};

// node.js
if((typeof module !== 'undefined') && (typeof module.exports !== 'undefined')) {
	module.exports = Almanac;
// browser
} else if(typeof window !== 'undefined') {
	window.Almanac = Almanac;
}

})();