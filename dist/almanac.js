(function () {
'use strict';

var isNode, isElement, isDOM, checkClassNames, nDays,
	addClasses, isArray, validMonthNames, addCSS,
	zero, getMonthCode, addEventListener,
	addClass, removeClass, validIdName, getDayCode, getDayData, getMonthData, renderIndent, insertMonth;

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
		CSSs = '[data-almanac]{padding:.5%}[data-almanac] *{text-align:center;box-sizing:border-box}[data-almanac] header{width:98%}[data-almanac] a.floatleft{float:left;background:#333;color:#fff;padding:.4em;cursor:pointer}[data-almanac] a.floatright{float:right;background:#333;color:#fff;padding:.4em;cursor:pointer}[data-almanac],[data-almanac] [data-almamonth],[data-almanac] header,[data-almanac] label{float:left;border:1px solid #aaa;border-radius:.3em;background-color:#fff;color:#333;line-height:2.5em}[data-almanac] [data-almaday],[data-almanac] [data-almamonth] header{height:12.28%;margin:1%}[data-almanac] [data-almamonth]{width:21em;height:21em;padding:.5em;margin:.5em;overflow:hidden}[data-almanac] [data-almamonth].hidden{width:0;margin:0;padding:0;height:0;border:0}[data-almanac] [data-almamonth] header{height:12.28%}[data-almanac] [data-almaday]{float:left;width:12.28%}[data-almanac] [data-almaday] input{display:none}[data-almanac] [data-almaday] label{width:100%;height:100%;cursor:pointer;transition:all .3s}[data-almanac] [data-almaday]:hover label{background:#333;color:#fff}[data-almanac] [data-almaday] input[type=checkbox]:checked+label,[data-almanac] [data-almaday] input[type=radio]:checked+label{background-color:#333;color:#fff}';

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
	return (n < 10) ? '0' + n : n.toString();
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
	var date = new Date( m.year, m.month -1, i + 1 );
	return {
		date: date,
		code : getDayCode(m, i+1),
		year : m.year,
		month : m.month,
		day : zero(i + 1),
		weekDay : date.getDay()
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

// check for valid list `l` of month names
validMonthNames = function (l) {
	var i;
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

var getNext = function (code, months) {
	var i, val = 99999999, number;
	code = Number( code );
	for (i in months) {
		number = Number(months[i].data.code);
		if (number > code && number < val ) {
			val = months[i].data.code;
		}
	}
	return val;
};

insertMonth = function (target, months, code) {
	var nextMonth = getNext( code, months );
	if (nextMonth === 99999999) {
		target.appendChild( months[ code ].el );
	} else {
		//target.insertBefore( months[ code ].el, target);
		//months[nextMonth].el.insertAdjacentHTML( 'beforebegin', months[code].el );
		target.insertBefore( months[code].el, months[nextMonth].el );
		//months[nextMonth].el.insertAdjacentHTML( 'beforebegin', months[code].el );
	}
};


var containsCode = function (code, list) {
	var i;
	for (i in list) {
		if (list[i].code === code ) {
			return true;
		}
	}
	return false;
};

// almanacs list
var aList = {};
var almanac = {};

var createCalendar = function (target, options) {


	// almanac options
	var opts = options || {},
		// for almanac itself
		cal, Month, Day, Header, MonthHeader;

	opts.cursor = 0;
	opts.revealed = [];

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
		throw new Error( 'Invalid showMonths property' );
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
	if (opts.noHeader && opts.showMonths === 1) {
		opts.noMonthHeader = opts.noMonthHeader || false;
	} else {
		opts.noMonthHeader = opts.noMonthHeader || true;
	}


	// sets the list of months to show at Almanac.revealed
	var show = function () {
		// get a copy of first day date
		var d = new Date( opts.firstDay ),
			i = 0,
			r = opts.revealed = [],
			m = this.months,
			e;

		// set first month to reveal
		d.setMonth( d.getMonth() + opts.cursor );

		// add months
		while (i < opts.showMonths) {
			e = new Date( d );
			e.setMonth( e.getMonth() + i );
			r.push( getMonthData( e ));
			i++;
		}

		// render required months
		for (i in r) {
			// check if month is in dates object
			if (!m[ r[i].code ]) {
				// add month to dates
				m[ r[i].code ] = new Month( r[i] );

				// print month
				insertMonth( target, m, r[i].code );
			}
		}


		// hide and show rendered months
		for (i in m) {
			// check if month is shown
			if (containsCode( m[i].data.code, r )) {
				m[i].show();
			} else {
				m[i].hide();
			}
		}
	};

	/*!
	 * Almanac header constructor
	 * @param {Object} alma almanac object
	 * @private
	 */

	Header = function () {

		var el, left, right;

		left  = this.left = document.createElement( 'a' );
		right = this.right = document.createElement( 'a' );
		left.innerHTML = '&lt;';
		right.innerHTML = '&gt;';
		left.setAttribute( 'class', 'floatleft');
		right.setAttribute( 'class', 'floatright');
		left.onclick = function () {
			cal.prev();
		};
		right.onclick = function () {
			cal.next();
		};
		el = document.createElement( 'header' );
		el.appendChild( left );
		el.appendChild( right );
		this.el = el;
	};


	MonthHeader = function (mData) {

		var el, left, right;

		left  = this.left = document.createElement( 'a' );
		right = this.right = document.createElement( 'a' );
		left.innerHTML = '&lt;';
		right.innerHTML = '&gt;';
		left.setAttribute( 'class', 'floatleft');
		right.setAttribute( 'class', 'floatright');
		left.onclick = function () {
			cal.prev();
		};
		right.onclick = function () {
			cal.next();
		};
		el = document.createElement( 'header' );
		el.innerHTML = opts.monthNames[ Number(mData.month) - 1 ] + ' ' + mData.year.slice( 2, 4 );
		el.appendChild( left );
		el.appendChild( right );
		this.el = el;
	};

	Day = function (d) {
		var el = this.el = document.createElement( 'div' ),
			self = this,
			inp, lab;

		this.data = d;
		this.checked = false;
		this.blocked = false;
		el.setAttribute( 'data-almaday', d.code );
		d.name = opts.name;
		d.id = d.name + '' + d.code;

		// create input
		inp = this.inp = document.createElement( 'input' );

		// Single or multiple selection
		inp.type = opts.multi ? 'checkbox' : 'radio';
		inp.name = opts.multi ? d.id : d.name;
		inp.id = d.id;
		inp.value = d.code;

		// binding for checked prop
		addEventListener( inp, 'change', function (e) {
			self.checked = (e.target.checked) ? true : false;
			self.onChange( self.checked );
		});

		// create label
		lab = this.lab = document.createElement( 'label' );
		lab.innerHTML = d.day;
		lab.setAttribute( 'for' , d.id );

		// insert elements into html
		el.appendChild( inp );
		el.appendChild( lab );
	};

	Day.prototype.check = function (force) {
		if (!this.isChecked() || force) {
			this.inp.checked = true;
			this.checked = true;
		}
	};

	Day.prototype.uncheck = function (force) {
		if (this.isChecked() || force) {
			this.inp.checked = false;
			this.checked = false;
		}
	};

	Day.prototype.isChecked = function () {
		return this.checked;
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
	Month = function (d) {
		// assign month in almanac months
		this.data = d;
		cal.months[ d.code ] = this;
		// get total days of the month
		d.n = nDays( d.year, d.month );
		var days = [],
			el,
			i = 0;

		this.days = days;
		this.visible = false;

		// create and insert calendar div
		el = this.el = document.createElement( 'div' );
		el.setAttribute( 'data-almamonth', d.code );

		// insert header with month name
		if (!opts.noMonthHeader) {
			el.appendChild( new MonthHeader(d) );
		} else {
			this.header = document.createElement( 'header' );
			this.header.innerHTML = opts.monthNames[ Number(d.month) - 1 ] + ' ' + d.year.slice( 2, 4 );
			this.el.appendChild( this.header );
		}

		// insert blank space before first month day
		el.innerHTML += renderIndent( new Date( d.year, d.month - 1, 1 ).getDay());

		// generate days
		while (i < d.n) {
			days.push( new Day( getDayData( d,  i )));
			el.appendChild( days[i].el );
			i++;
		}
	};

	Month.prototype.show = function () {
		this.visible = true;
		removeClass( this.el, 'hidden' );
	};

	Month.prototype.hide = function () {
		this.visible = false;
		addClass( this.el, 'hidden');
	};

	Month.prototype.isVisible = function () {
		return this.visible;
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
	var Calendar = function () {

		this.months = {};
		this.days = {};
		this.el = target;
		cal = this;

		addCSS();

		target.setAttribute( 'name', opts.name );
		// set id
		if (opts.id) {
			target.setAttribute( 'id', opts.id );
		}
		// add classes
		if (opts.classes) {
			addClasses( target, opts.classes );
		}
		// set custom data in element
		target.setAttribute( 'data-almanac', '' );
		// add header
		if (!opts.noHeader) {
			opts.header = new Header( this );
			target.appendChild( opts.header.el );
		}

		show.call( this );
	};

	Calendar.prototype.next = function () {
		opts.cursor++;
		show.call( this );
	};

	Calendar.prototype.prev = function () {
		opts.cursor--;
		show.call( this );
	};

	Calendar.prototype.get = function (setting) {
		return opts[setting];
	};

	return new Calendar();
};


almanac.createCalendar = createCalendar;

almanac.list = function () {
	return aList;
};

almanac.reset = function () {
	// reset an almanac to init state
};

almanac.clean = function () {
	// empty almanac selection/s
};

/*!
 * Expose module
 */
// node.js / browserify / component
if((typeof module !== 'undefined') && (typeof module.exports !== 'undefined')) {
	module.exports = almanac;
// browser
} else if (typeof window !== 'undefined') {
	window.almanac = almanac;
}
})();