(function () {
'use strict';

var isNode, isElement, isDOM, checkClassNames,
	addClasses, isArray, validMonthNames, addCSS, Header, Month,
	zero, show, getMonthCode, reveal, nDays, Day, addEventListener,
	addClass, removeClass, validIdName, createAlmanac, getDayCode, getDayData, getMonthData, renderIndent;

// Returns true if it is a DOM node
isNode = function (o) {
	return (
		typeof Node === 'object' ? o instanceof Node :
		o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName==='string'
	);
};
// Returns true if it is a DOM element
isElement = function (o) {
	return (
		typeof HTMLElement === 'object' ? o instanceof HTMLElement : //DOM2
		o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName==='string'
	);
};
// Returns true if it is a DOM element or node
isDOM = function (o) {
	return (isNode( o ) || isElement( o ));
};


/*!
 * Methods for CSS manipulations
 */

addClass = function (el, cls) {
	if (el.classList){
		el.classList.add( cls);
	} else {
		el.className += ' ' + cls;
	}
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

addClasses = function (el, classes) {
	var l = classes.split(' '), i;
	for (i in l) {
		if (el.classList) {
			// the browsers
			el.classList.add( l[i] );
		} else {
			// iExplorer
			el.className += ' ' + l[i];
		}
	}
};

// check if a class/id name is valid
validIdName = function (cls) {
	return (!/^[a-z_-][a-z\d_-]*$/i.test( cls )) ? false : true;
};


// check if String with list of HTML classes separated by spaces is correct and not start with number
checkClassNames = function (classes) {
	var l = classes.split(' '), i;
	for (i in l) {
		if (!validIdName( l[i] )) {
		   return true;
		}
	}
	return false;
};

// inject css in html header
addCSS = function () {
	var s = document.getElementById('almanac-style'),
		CSSs = '[data-almanac]{padding:.5%}[data-almanac] *{text-align:center;box-sizing:border-box;transition:all .3s}[data-almanac] header{width:98%}[data-almanac] a.floatleft{float:left;background:#333;color:#fff;padding:.4em;cursor:pointer}[data-almanac] a.floatright{float:right;background:#333;color:#fff;padding:.4em;cursor:pointer}[data-almanac],[data-almanac] [data-almamonth],[data-almanac] header,[data-almanac] label{float:left;border:1px solid #aaa;border-radius:.3em;background-color:#fff;color:#333;line-height:2.5em}[data-almanac] [data-almaday],[data-almanac] [data-almamonth] header{height:12.28%;margin:1%}[data-almanac] [data-almamonth]{width:21em;height:21em;padding:.5em;margin:.5em;overflow:hidden}[data-almanac] [data-almamonth].hidden{width:0;margin:0;padding:0;height:0;border:0}[data-almanac] [data-almamonth] header{height:12.28%}[data-almanac] [data-almaday]{float:left;width:12.28%}[data-almanac] [data-almaday] input{display:none}[data-almanac] [data-almaday] label{width:100%;height:100%;cursor:pointer}[data-almanac] [data-almaday]:hover label{background:#333;color:#fff}[data-almanac] [data-almaday] input[type=checkbox]:checked+label,[data-almanac] [data-almaday] input[type=radio]:checked+label{background-color:#333;color:#fff}';

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


/*!
 * Operations
 */

// check if is array
isArray = function (arr) {
	return arr && {}.toString.call( arr ) === '[object Array]';
};

// add zero to number n if n < 10
zero = function (n) {
	return (n < 10) ? '0' + n : n;
};

// get month code in format YYYYMM from a date object
getMonthCode = function (d) {
	return d.getFullYear() + '' + (zero( d.getMonth()+1 ));
};

// get day code in format YYYYMMDD from a monthCode and day number
getDayCode = function (m, n) {
	return m.code + '' + zero( n );
};

// get day data from a monthData and day position
getDayData = function (m, i) {
	return {
		date: new Date( m.year, m.month -1, i + 1 ),
		code : getDayCode(m, i+1),
		year : m.year,
		month : m.month,
		day : zero(i + 1)
	};
};

// get month data from a date
getMonthData = function (d) {
	var c = getMonthCode(d);
	return {
		code : c,
		year : c.slice(0, 4),
		month : c.slice(4, 6)
	};
};

// get number of days in month
nDays = function (year, month) {
	return new Date( Number(year), Number(month) , 0 ).getDate();
};

// check for valid month names
validMonthNames = function () {
	var l = this.settings.monthNames,
		i;
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

// Render indentation for first month day
renderIndent = function ( n ) {
	n = (n === 0) ? 6 * 14.28 : (n-1) * 14.28;
	return '<div style="float:left;width:' + n + '%;text-indent:-999999px;">.</div>';
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


createAlmanac = function (target, opts) {
	var a = opts.a,
		el = a.el;
	target.setAttribute( 'name', opts.name );
	// set id
	if (opts.id) {
		el.setAttribute( 'id', opts.id );
	}
	// add classes
	if (opts.classes) {
		addClasses( el, opts.classes );
	}
	// set custom data in element
	el.setAttribute( 'data-almanac', '' );
	// add header
	if (!opts.noHeader) {
		a.header = new Header( opts.obj );
		el.appendChild( a.header.el );
	}
	show.call( a );
};

// render months that need to be rendered from Almanac.revealed
reveal = function () {
	var r = this.revealed,
		d = this.months,
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
		this.revealed.push( getMonthData( e ));
		i++;
	}
	reveal.call( this );
};





Day = function (a, d) {
	var el = this.el = document.createElement( 'div' ),
		self = this,
		inp, lab;

	this.data = d;
	this.checked = false;
	this.blocked = false;
	el.setAttribute( 'data-almaday', d.code );
	d.name = a.settings.name;
	d.id = d.name + '' + d.code;

	// create input
	inp = this.inp = document.createElement( 'input' );

	// Single or multiple selection
	inp.type = a.settings.multi ? 'checkbox' : 'radio';
	inp.name = a.settings.multi ? d.id : d.name;
	inp.id = d.id;

	// binding for checked prop
	addEventListener( inp, 'change', function (e) {
		self.checked = (e.target.checked !== false) ? true : false;
	});

	// create label
	lab = this.lab = document.createElement( 'label' );
	lab.innerHTML = d.day;
	lab.setAttribute( 'for' , d.id );

	// insert elements into html
	el.appendChild( inp );
	el.appendChild( lab );
};

Day.prototype.check = function () {
	this.el.checked = true;
};

Day.prototype.uncheck = function () {
	this.el.checked = undefined;
};

Day.prototype.isChecked = function () {
	// check state
};

Day.prototype.toggle = function () {
	// toggle state
};

Day.prototype.getCode = function () {
	// return code
};

Day.prototype.getInfo = function () {
	// return day info onbject
};

Day.prototype.onChange = function () {
	// bind and trigger
};

// month constructor
Month = function (a, d) {
	// assign month in almanac months
	this.data = d;
	a.months[ d.code ] = this;
	// get total days of the month
	d.n = nDays( d.year, d.month );
	var days = [],
		el,
		i = 0;

	this.days = days;
	this.revealed = false;

	// create and insert calendar div
	el = this.el = document.createElement( 'div' );
	el.setAttribute( 'data-almamonth', d.code );

	// insert header with month name
	var header = this.header =  document.createElement( 'header' );
	header.innerHTML = a.settings.monthNames[ Number(d.month) - 1 ] + ' ' + d.year.toString().slice( 2, 4 );
	el.appendChild( header );

	// insert blank space before first month day
	el.innerHTML += renderIndent( new Date( d.year, d.month -1 , 1 ).getDay());

	// generate days
	while (i < d.n) {
		days.push( new Day( a, getDayData( d,  i )));
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

Month.prototype.isVisible = function () {
	return this.revealed;
};


/**
 * Almanac header constructor
 * @param {Object} alma almanac object
 * @private
 */

Header = function (alma) {

	var el, left, right;

	left  = this.left = document.createElement( 'a' );
	right = this.right = document.createElement( 'a' );
	left.innerHTML = '&lt;';
	right.innerHTML = '&gt;';
	left.setAttribute( 'class', 'floatleft');
	right.setAttribute( 'class', 'floatright');
	left.onclick = function () {
		alma.prev();
	};
	right.onclick = function () {
		alma.next();
	};
	el = document.createElement( 'header' );
	el.appendChild( left );
	el.appendChild( right );
	this.el = el;
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
 * - **`noHeader`**: Don't show almanac header
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

	// check name exists
	if (!opts.name) {
		throw new Error( 'Almanac element needs a name' );
	}

	// input multi:
	// false => radio
	// true => checkbox
	opts.multi = opts.multi || false;
	// months to show at time
	opts.showMonths = opts.showMonths || 1;
	// throw error on bad showMonths property
	if (typeof opts.showMonths !== 'number' || opts.showMonths < 1 || (opts.showMonths % 1) !== 0) {
		throw new Error( 'Invalid monthName property' );
	}
	// optional id for element
	opts.id = opts.id || this.el.getAttribute('id') || false;
	// check for valid id property
	if (opts.id) {
		if (typeof opts.id !== 'string' || !validIdName( opts.id )) {
			throw new Error( 'Invalid id property' );
		}
	}

	// classes
	if (opts.classes) {
		// check for valid classes
		if (typeof opts.classes !== 'string' || checkClassNames( opts.classes )) {
			throw new Error( 'Invalid classes property' );
		}
	}

	// default monthNames in English
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

	// noHeader
	opts.noHeader = opts.noHeader || false;

	this.months = {};
	this.days = {};
	this.cursor = 0;
	this.revealed = [];

	addCSS();

	opts.a = this;

	createAlmanac( target, opts );
};

Almanac.prototype.next = function () {
	this.cursor++;
	show.call( this );
};

Almanac.prototype.prev = function () {
	this.cursor--;
	show.call( this );
};

Almanac.prototype.get = function (setting) {
	// return value
};

Almanac.prototype.set = function (setting, value) {
	// return value
};

// node.js / browserify / component
if((typeof module !== 'undefined') && (typeof module.exports !== 'undefined')) {
	module.exports = Almanac;
// browser
} else if (typeof window !== 'undefined') {
	window.Almanac = Almanac;
}

})();