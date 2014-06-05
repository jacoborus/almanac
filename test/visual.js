'use strict';

var bulkElem = function () {
	var el = document.createElement( 'div' );
	el.setAttribute( 'name', 'bulkElem');
	return el;
};

var hasClass = function (el, cls) {
	if (el.classList) {
		return el.classList.contains( cls );
	} else {
		return new RegExp( '(^| )' + cls + '( |$)', 'gi' ).test( el.className );
	}
}

var addClass = function (el, className) {
	if (el.classList) {
		el.classList.add(className);
	} else {
		el.className += ' ' + className;
	}
};

// check if is array
var isArray = function (arr) {
	return arr && {}.toString.call( arr ) === '[object Array]';
};

var zero = function (n) {
	if (n < 10) {
		return '0' + n;
	} else {
		return n;
	}
};

// get get month code in format YYYYMM from a date object
var getMonthCode = function (d) {
	return d.getFullYear() + '' + (zero( d.getMonth()+1 ));
};


var almanac = new Almanac( document.getElementById( 'rendered' ));
var today = new Date();
var nToday = today.getDate() - 1;
var monthCode = getMonthCode( today );
var firstMonth = almanac.months[getMonthCode( today )];
var todayCode = Number( today.getFullYear() + '' + zero( today.getMonth() + 1 ) + '' + zero( today.getDate()));


firstMonth.days[nToday].inp.checked = false;
firstMonth.days[nToday].check();
firstMonth.days[10].check();
//expect( firstMonth.days[nToday].inp.checked).to.equal( true );