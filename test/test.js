'use strict';

var expect = chai.expect;

var bulkElem = function () {
	var el = document.createElement( 'div' );
	el.setAttribute( 'name', 'bulkElem');
	return el;
};


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
				var el = bulkElem();
				new Almanac( el );
			}).to.not.throw( Error );

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
			var el = document.getElementById( 'almanac' );
			var almanac = new Almanac( el );
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
			expect( almanac.settings.hideHeader ).to.equal( false );

			var el2 = bulkElem();
			var almanac = new Almanac( el2, {hideHeader: true} );
			expect( almanac.settings.hideHeader ).to.equal( true );
		});

		// dates
		it( 'has `dates` property as object', function () {
			var el = bulkElem();
			var almanac = new Almanac( el );
			expect( typeof almanac.dates ).to.equal( 'object' );
		});

		// cursor
		it( 'has `cursor` property 0 by default', function () {
			var el = bulkElem();
			var almanac = new Almanac( el );
			expect( almanac.cursor ).to.equal( 0 );
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

	it( 'append prev and next buttons', function () {
		expect( header.getElementsByTagName( 'a' )[0] ).to.exist;
		expect( header.getElementsByTagName( 'a' )[1] ).to.exist;
	});

	it( 'buttons move the cursor', function () {
		header.getElementsByTagName( 'a' )[0].click();
		expect( almanac.cursor ).to.equal( -1 );
		header.getElementsByTagName( 'a' )[1].click();
		header.getElementsByTagName( 'a' )[1].click();
		expect( almanac.cursor ).to.equal( 1 );
	});
});