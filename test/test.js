'use strict';

var expect = chai.expect;

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
var rendered = new Almanac( document.getElementById( 'rendered' ));
/** -- ALMANAC -- **/

describe( 'Almanac', function () {

	describe( 'constructor', function () {

		// target
		it( 'throws an error if target is not passed', function () {
			expect( function () {
				new Almanac();
			}).to.throw( 'Missing target argument creating Almanac' );
		});

		it( 'throws error when target is not a DOM element or node', function () {
			expect( function () {
				new Almanac( 'hello' );
			}).to.throw( 'Target has to be a DOM element' );

			expect( function () {
				new Almanac( 1 );
			}).to.throw( 'Target has to be a DOM element' );

			expect( function () {
				new Almanac( {} );
			}).to.throw( 'Target has to be a DOM element' );
		});


		// options
		it( 'throws an error if `options` is not an object', function () {
			var el = bulkElem();
			expect( function () {
				new Almanac( el, 'hi' );
			}).to.throw( 'options has to be a object' );
		});

		it( 'saves HTML element at `el` property', function () {
			var el = bulkElem();
			var almanac = new Almanac( el );
			expect( typeof almanac.el ).to.equal( 'object');
		});

		it( 'has an object settings', function () {
			var el = bulkElem();
			var almanac = new Almanac( el );
			expect( almanac.settings ).to.exist;
		});


		// name
		it( 'throws an error if almanac or its DOM element has not a name', function () {
			var el = document.getElementById( 'noName' );
			expect( function () {
				new Almanac( el );
			}).to.throw( 'Almanac element needs a name' );
		});

		it( 'sets the name from html', function () {
			var el = document.createElement( 'div' );
			el.setAttribute( 'name', 'example' );
			var almanac = new Almanac( el, {showMonths: 2, multi: true} );
			expect( almanac.settings.name ).to.equal( 'example' );
		});

		it( 'sets the name from options', function () {
			var el = bulkElem();
			var almanac = new Almanac( el, {name: 'noName'});
			expect( almanac.el.getAttribute( 'name' )).to.equal( 'noName' );
		});


		// multi
		it( 'sets `multi` property as false by default', function () {
			var el = bulkElem();
			var almanac = new Almanac( el );
			expect( almanac.settings.multi ).to.equal( false );
		});

		it( 'sets `multi` property from options', function () {
			var el = bulkElem();
			var almanac = new Almanac( el, {multi: 2});
			expect( almanac.settings.multi ).to.equal( 2 );
		});


		// showMonths
		it( 'throws an error if `showMonths` property is not a valid number', function () {
			var el = bulkElem();
			expect( function () {
				new Almanac( el, {showMonths: 'a'} );
			}).to.throw( 'Invalid monthName property' );
			var el2 = bulkElem();
			expect( function () {
				new Almanac( el2, {showMonths: -2} );
			}).to.throw( 'Invalid monthName property' );
			var el3 = bulkElem();
			expect( function () {
				new Almanac( el3, {showMonths: 1.5} );
			}).to.throw( 'Invalid monthName property' );
		});


		// id
		it( 'throws an error if `id` property is not a valid element id', function () {
			var el = bulkElem();
			expect( function () {
				new Almanac( el, {id: 1} );
			}).to.throw( 'Invalid id property' );
			var el2 = bulkElem();
			expect( function () {
				new Almanac( el2, {id: '1a'} );
			}).to.throw( 'Invalid id property' );
		});

		it( 'sets `id` property from options', function () {
			var el = bulkElem();
			var almanac = new Almanac( el, {id: 'hey'});
			expect( almanac.el.getAttribute( 'id' )).to.equal( 'hey' );
		});


		// classes
		it( 'throws an error if `classes` are not a valid', function () {
			var el = bulkElem();
			expect( function () {
				new Almanac( el, {classes: 1} );
			}).to.throw( 'Invalid classes property' );
			var el2 = bulkElem();
			expect( function () {
				new Almanac( el2, {classes: '1a b'} );
			}).to.throw( 'Invalid classes property' );
		});

		it( 'sets `classes` property from options', function () {
			var el = bulkElem();
			var almanac = new Almanac( el, {classes: 'hey hola'});
			expect( almanac.el.getAttribute( 'class' )).to.equal( 'hey hola' );
		});


		// monthNames
		it( 'sets `monthNames` property in English by default', function () {
			var el = bulkElem();
			var almanac = new Almanac( el );
			expect( almanac.settings.monthNames[0] ).to.equal( 'January' );
		});

		it( 'throws an error if `monthNames` are not a valid', function () {
			var el = bulkElem();
			expect( function () {
				new Almanac( el, {monthNames: 1} );
			}).to.throw( 'Invalid monthNames property' );
			var el2 = bulkElem();
			expect( function () {
				new Almanac( el2, {monthNames: ['January', 2, 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']} );
			}).to.throw( 'Invalid monthNames property' );
			var el3 = bulkElem();
			expect( function () {
				new Almanac( el3, {monthNames: ['January', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']} );
			}).to.throw( 'Invalid monthNames property' );
		});

		it( 'sets `monthNames` property from options', function () {
			var el = bulkElem();
			var almanac = new Almanac( el, {monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']});
			expect( almanac.settings.monthNames[0] ).to.equal( 'Enero' );
		});

		// firstDay
		it( 'sets today as day of first month to show by default', function () {
			var el = bulkElem();
			var today = new Date();
			var almanac = new Almanac( el );
			expect( almanac.settings.firstDay.toString() ).to.equal( today.toString() );
		});

		it( 'sets firstDay property from options', function () {
			var el = bulkElem();
			var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
			var almanac = new Almanac( el, {firstDay: tomorrow});
			expect( almanac.settings.firstDay.toString() ).to.equal( tomorrow.toString() );
		});

		it( 'throws an error if `firstDay` is not a valid', function () {
			var el = bulkElem();
			expect( function () {
				new Almanac( el, {firstDay: 1} );
			}).to.throw( 'Invalid firstDay property' );
		});

		// hideHeader
		it( 'set hideHeader from options or false by default', function () {
			var el = bulkElem();
			var almanac = new Almanac( el );
			expect( almanac.settings.noHeader ).to.equal( false );

			var el2 = bulkElem();
			var almanac2 = new Almanac( el2, {hideHeader: true} );
			expect( almanac2.settings.hideHeader ).to.equal( true );
		});

		// dates
		it( 'has `months` and `days` properties as objects', function () {
			var el = bulkElem();
			var almanac = new Almanac( el );
			expect( typeof almanac.months ).to.equal( 'object' );
			expect( typeof almanac.days ).to.equal( 'object' );
		});

		// custom data aka [data-almanac]
		it( 'set custom data "data-almanac" to element', function () {
			var el = bulkElem();
			var almanac = new Almanac( el );
			expect( almanac.el.getAttribute( 'data-almanac' ) ).to.exist;
		});

		// cursor
		it( 'has `cursor` property 0 by default', function () {
			var el = bulkElem();
			var almanac = new Almanac( el );
			expect( almanac.cursor ).to.equal( 0 );
		});

		// revealed
		it( 'has array `revealed` property empty by default', function () {
			var el = bulkElem();
			var almanac = new Almanac( el );
			expect( almanac.revealed ).to.be.an( 'array');
		});

		// css
		it( 'inject css in document header', function () {
			expect( document.getElementById( 'almanac-style' )).to.not.equal( null );
		});

		it( 'append header to calendar element if required', function () {
			var el = bulkElem();
			var almanac = new Almanac( el );
			expect( almanac.el.getElementsByTagName( 'header' )[0] ).to.exist;
		});
	});


	describe( '#next', function () {

		it( '+1 to cursor', function () {
			var el = bulkElem();
			var almanac = new Almanac( el );
			almanac.next();
			expect( almanac.cursor ).to.equal( 1 );
		});
	});

	describe( '#prev', function () {

		it( '-1 to cursor', function () {
			var el = bulkElem();
			var almanac = new Almanac( el );
			almanac.prev();
			expect( almanac.cursor ).to.equal( -1 );
		});
	});

});

describe( 'Header', function () {

	var el = bulkElem();
	var almanac = new Almanac( el );
	var header = almanac.el.getElementsByTagName( 'header' )[0];
	var left = header.getElementsByTagName( 'a' )[0];
	var right = header.getElementsByTagName( 'a' )[1];

	it( 'append prev and next buttons', function () {
		expect( left ).to.exist;
		expect( right ).to.exist;
	});
/*
	it( 'buttons move the cursor', function () {
		right.click();
		expect( almanac.cursor ).to.equal( 1 );
	});
*/
});

/*
describe( 'show', function () {
	it( 'sets months to show in Almanac.revealed', function () {
		var el = bulkElem();
		var almanac = new Almanac( el );
		var today = new Date();
		var monthCode = getMonthCode( today );
		expect( almanac.revealed[0] ).to.equal( monthCode );
	});
});


describe( 'reveal', function () {

	var el = bulkElem();
	var almanac = new Almanac( el, {showMonths: 4} );
	var today = new Date();
	var monthCode = getMonthCode( today );

	it( 'adds months to Almanac.dates if not exist', function () {
		expect( almanac.dates[monthCode] ).to.exist;
	});

	it( 'print rendered months in calendar', function () {
		expect( almanac.el.getElementsByTagName( 'div' ).length ).to.be.above( 0 );
	});

});
*/

describe( 'Month', function () {

	describe( 'constructor', function () {

		var el = bulkElem();
		var almanac = new Almanac( el );
		var today = new Date();
		var firstMonth;
		var monthCode = getMonthCode( today );

		it( 'sets itself in Almanac.months', function () {
			firstMonth = almanac.months[getMonthCode( today )];
			expect( firstMonth ).to.exist;
		});

		it( 'has `year` property in format "YYYY"', function () {
			expect( firstMonth.data.year ).to.equal( monthCode.slice( 0,4 ));
		});

		it( 'has `month` property in format "MM"', function () {
			expect( firstMonth.data.month ).to.equal( monthCode.slice( 4,6 ));
		});

		it( 'has `el` property containing HTML month element', function () {
			expect( firstMonth.el ).to.exist;
		});

		it( 'has `days` array ', function () {
			expect( firstMonth.days ).to.exist;
			expect( isArray( almanac.months[getMonthCode( today )].days )).to.equal( true );
		});

		it( 'has `revealed` property', function () {
			expect( firstMonth.revealed ).to.exist;
		});

		it( '`el` has data-almaMonth property and it is correct', function () {
			expect( firstMonth.el.getAttribute( 'data-almaMonth' )).to.exist;
			expect( firstMonth.el.getAttribute( 'data-almaMonth' )).to.equal( monthCode );
		});


		it( 'renders correct indent in month element' );

		it( 'starts with the correct day of the week' );

		it( 'print days in calendar', function () {
			expect( firstMonth.el.getElementsByTagName( 'div' ).length ).to.be.above( 27 );
		});

		it( 'has the correct number of days', function () {
			var daysInMonth = new Date( Number(monthCode.slice(2,4)), Number(monthCode.slice(4, 6) ) , 0 ).getDate();
			expect( firstMonth.days.length ).to.equal( daysInMonth );
		} );
	});

	describe( '#show', function () {
		var el = bulkElem();
		var almanac = new Almanac( el );
		var today = new Date();
		var firstMonth;
		var monthCode = getMonthCode( today );
		almanac.months[ monthCode ].revealed = false;
		it( 'sets true `revealed` property', function () {
			almanac.months[ monthCode ].show();
			expect( almanac.months[ monthCode ].revealed ).to.equal( true );
		});
		it( 'show the month element', function () {
			expect( hasClass( almanac.months[ monthCode ].el, 'hidden' )).to.equal( false );
		});
	});

	describe( '#hide', function () {
		var el = bulkElem();
		var almanac = new Almanac( el );
		var today = new Date();
		var firstMonth;
		var monthCode = getMonthCode( today );
		almanac.months[ monthCode ].revealed = true;
		addClass( almanac.months[ monthCode ].el, 'hidden' );
		it( 'change `revealed` property', function () {
			almanac.months[ monthCode ].hide();
			expect( almanac.months[ monthCode ].revealed ).to.equal( false );
		});
		it( 'hide the month element', function () {
			expect( hasClass( almanac.months[ monthCode ].el, 'hidden' )).to.equal( true );
		});
	});
});

describe( 'Day', function () {

	var el = bulkElem();
	var almanac = new Almanac( el );
	var today = new Date();
	var nToday = today.getDate() - 1;
	var monthCode = getMonthCode( today );
	var firstMonth = almanac.months[getMonthCode( today )];
	var todayCode = Number( today.getFullYear() + '' + zero( today.getMonth() + 1 ) + '' + zero( today.getDate()));

	describe( 'constructor', function () {

		it( 'has date `date` property', function () {
			console.log( firstMonth.days );
			expect( firstMonth.days[nToday].data.date.toDateString() ).to.equal( today.toDateString() );
		});

		it( 'has `year` property in format "YYYY"', function () {
			expect( firstMonth.days[0].data.year ).to.equal( monthCode.slice( 0, 4 ));
		});

		it( 'has `month` property in format "MM"', function () {
			expect( firstMonth.days[0].data.month ).to.equal( monthCode.slice( 4, 6 ));
		});

		it( 'has boolean `checked` property', function () {
			expect( typeof firstMonth.days[nToday].checked ).to.equal( 'boolean' );
		});

		it( 'has boolean `blocked` property', function () {
			expect( typeof firstMonth.days[0].blocked ).to.equal( 'boolean' );
		});

		it( 'print its element in month.el', function () {
			expect( firstMonth.days[0].el ).to.exist;
		});

		it( 'has `el` property containing input element', function () {
			expect( firstMonth.days[0].el.getElementsByTagName( 'input' ).length ).to.be.above( 0 );
		});

		it( 'has `el` property containing label element', function () {
			expect( firstMonth.days[0].el.getElementsByTagName( 'label' ).length ).to.be.above( 0 );
		});

		it( 'has `code` property in format "YYYYMMDD"', function () {
			expect( firstMonth.days[nToday].data.code ).to.equal( todayCode.toString() );
		});
		it( '`el` has data-almaday property and it equal its code', function () {
			expect( firstMonth.days[nToday].el.getAttribute( 'data-almaday' )).to.equal( todayCode.toString() );
		});

		it( 'binds click to check/uncheck' );
	});

	describe( '#check', function () {
		it( 'change `checked` to `true` property in element and object', function () {
			firstMonth.days[nToday].el.checked = undefined;
			firstMonth.days[nToday].check();
			expect( firstMonth.days[nToday].el.checked ).to.exist;
		});
	});

	describe( '#uncheck', function () {
		it( 'change `checked` property to `false` in element and object', function () {
			firstMonth.days[nToday].el.checked = true;
			firstMonth.days[nToday].uncheck();
			expect( firstMonth.days[nToday].el.checked ).to.not.exist;
		});
	});
});
