(function () {
'use strict';

var isNode, isElement, isDOM, checkClasses,
	setClasses, isArray, validMonthNames, addCSS, Header, Month,
	zero, show, getMonthCode, reveal, nDays, Day, addEventListener,
	addClass, removeClass, validName;

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

removeClass = function (el, cls) {
	// test for iE8-9
	if (el.classList) {
		// remove class
		el.classList.remove( cls );
	} else {
		// remove class for iE8 & iE9
		el.className = el.className.replace(new RegExp('(^|\\b)' + cls.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	}
};


addClass = function (el, cls) {
	if (el.classList){
		el.classList.add( cls);
	} else {
		el.className += ' ' + cls;
	}
};


// addEventListener for all
addEventListener = function (el, eventName, handler) {
	if (el.addEventListener) {
		// the world
		el.addEventListener( eventName, handler );
	} else {
		// Internet Explorer
		el.attachEvent( 'on' + eventName, handler );
	}
};

validName = function (cls) {
	return (!/^[a-z_-][a-z\d_-]*$/i.test( cls )) ? false : true;
};


// check if String with list of HTML classes separated by spaces is correct and not start with number
checkClasses = function (classes) {
	var l = classes.split(' '), i;
	for (i in l) {
		if (!validName( l[i] )) {
		   return true;
		}
	}
	return false;
};



setClasses = function () {
	var l = this.settings.classes.split(' '), i;
	for (i in l) {
		if (this.el.classList) {
			// the browsers
			this.el.classList.add( l[i] );
		} else {
			// iExplorer
			this.el.className += ' ' + l[i];
		}
	}
};


// check if is array
isArray = function (arr) {
	return arr && {}.toString.call( arr ) === '[object Array]';
};


validMonthNames = function () {
	var l = this.settings.monthNames, i;
	if (l.length !== 12) {
		return false;
	}
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
		CSSs = '{{injectCSS}}';

	if (s === null) {
		s = document.createElement( 'style' );
		s.type = 'text/css';
		s.setAttribute( 'id', 'almanac-style');
		document.getElementsByTagName( 'head' )[0].appendChild( s );
		if (s.styleSheet) {   // IE
			s.styleSheet.cssText = CSSs;
		} else {              // the world
			s.appendChild( document.createTextNode( CSSs ));
		}
	}
};

/**
 * add zero to number if < 10
 * @param  {Number} n number to put zero into
 * @return {Number}   2 digits number
 */
zero = function (n) {
	return (n < 10) ? '0' + n : n;
};

// get get month code in format YYYYMM from a date object
getMonthCode = function (d) {
	return d.getFullYear() + '' + (zero( d.getMonth()+1 ));
};


// sets the list of months to show at Almanac.revealed
show = function () {
	// get a copy of first day date
	var d = new Date( this.settings.firstDay ),
		i = 0, e;

	// empty revealed list
	this.revealed = [];

	// set first month to reveal
	d.setMonth( d.getMonth() + this.cursor );

	// add months
	while (i < this.settings.showMonths) {
		e = new Date( d );
		e.setMonth( e.getMonth() + i );
		this.revealed.push( getMonthCode( e ));
		i++;
	}
	reveal.call( this );
};

// render months that need to be rendered from Almanac.revealed
reveal = function () {
	var r = this.revealed,
		d = this.dates,
		i;

	// render required months
	for (i in r) {
		// check if month is in dates object
		if (!d[ r[i] ]) {
			// add month to dates
			d[ r[i] ] = new Month( this, r[i] );
			// print month
			this.el.appendChild( d[r[i]].el );
		}
	}

	// hide and show rendered months
	for (i in d) {
		// check if month is shown
		if (this.revealed.indexOf( i )) {
			d[i].show();
		} else {
			d[i].hide();
		}
	}
};


// get number of days in month
nDays = function (year, month) {
	return new Date( Number(year), Number(month) , 0 ).getDate();
};


Day = function (alma, year, month, day) {
	var self = this, inp, lab;
	this.date = new Date( year, month-1, day );
	this.year = year;
	this.month = month;
	this.checked = false;
	this.blocked = false;
	this.code = Number( year + '' + zero(month) + '' + zero(day) );
	this.el = document.createElement( 'div' );
	this.el.setAttribute( 'data-almaday', this.code );
	this.name = alma.settings.name;
	this.id = this.name + '' + this.code;

	// create input
	inp = this.inp = document.createElement( 'input' );

	// Single or multiple selection
	inp.type = alma.settings.multi ? 'checkbox' : 'radio';
	inp.name = alma.settings.multi ? this.id : this.name;
	inp.id = this.id;



	// binding for checked prop
	addEventListener( inp, 'change', function (e) {
		self.checked = (e.target.checked !== false) ? true : false;
	});


	// create label
	lab = this.lab = document.createElement( 'label' );
	lab.innerHTML = this.date.getDate();
	lab.setAttribute( 'for' , this.id );

	// insert elements into html
	this.el.appendChild( inp );
	this.el.appendChild( lab );
};

Day.prototype.check = function () {
	this.el.checked = true;
};

Day.prototype.uncheck = function () {
	this.el.checked = undefined;
};


// month constructor
Month = function (alma, code) {
	// assign month in almanac dates
	alma.dates[ code ] = this;
	var year = this.year = Number( code.slice(0,4) ),
		days = this.days = [],
		num = this.month = Number( code.slice( 4,6 )),
		// get total days of the month
		n = nDays( year, num ),
		el, i = 0;

	this.revealed = false;


	// create and insert calendar div
	el = this.el = document.createElement( 'div' );
	el.setAttribute( 'data-almamonth', code );

	// insertheader with month name
	var header = this.header =  document.createElement( 'header' );
	header.innerHTML = alma.settings.monthNames[ Number(num) - 1 ] + ' ' + year.toString().slice(2,4);
	el.appendChild( header );

	// insert blank space before first month day
	// el.innerHTML += renderIndent( new Date( year, month, 1 ).getDay());

	// generate days
	while (i < n) {
		days.push( new Day( alma, year, num, i));
		el.appendChild( days[i].el );
		i++;
	}
};

Month.prototype.show = function () {
	this.revealed = true;
	removeClass( this.el, 'hidden' );
};

Month.prototype.hide = function () {
	this.revealed = false;
	addClass( this.el, 'hidden');
};


/**
 * Almanac header constructor
 * @param {Object} alma almanac object
 * @private
 */

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
		if (typeof opts.id !== 'string' || !validName( opts.id )) {
			throw new Error( 'Invalid id property' );
		}
	}
	// set id
	if (opts.id) {
		this.el.setAttribute( 'id', opts.id );
	}

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
	// set custom data in element
	this.el.setAttribute( 'data-almanac', '' );

	show.call( this );
};



Almanac.prototype.next = function () {
	this.cursor++;
	show.call( this );
};

Almanac.prototype.prev = function () {
	this.cursor--;
	show.call( this );
};

// node.js
if((typeof module !== 'undefined') && (typeof module.exports !== 'undefined')) {
	module.exports = Almanac;
// browser
} else if (typeof window !== 'undefined') {
	window.Almanac = Almanac;
}

})();