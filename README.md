Almanac
=======

**In early development**

HTML5 calendar element



## Usage

Link `almanaque.js` from your html file

```
<script src="path/to/almanaque.js"></script>
```

or require it with [Browserify](http://browserify.org/):

```javascript
var Almanac = require('path/to/almanac')
```

almanac.createCalendar( target, options )
-----------------------------------------

Create an almanac in/at `target` with passed options.

**Parameters:**

- **target** *HTML element*: Element to replace, or embed in the almanac
- **options** *Object*


Example:
```js
// get a HTML element
var elem = document.getElementById( 'myCalendar' );

// or create one and insert when you want
// var elem = document.createElement( 'div' );
// elem.setAttribute( 'name', 'myCalendarName')

// then create a calendar
var calendar = almanac.createCalendar( elem, {
multi: true,
showMonths: 2
});
```

#### `options`:

- **`name`**: Sets `name` as input name
- **`multi`**: Sets single (input[type="radio"]) or multiple (input[type="checkbox"]) day selection.
- **`showMonths`**: Months to show in calendar at once
- **`id`**: Set `id` as almanac element id
- **`classes`**: Add `classes` to almanac element. Separated by spaces
- **`monthNames`**: List of month names. English names by default
- **`firstDay`**: A day from first month to show in almanac
- **`title`**: title for header calendar
- **`noHeader`**: Don't show almanac header
- **`binding`**: function to launch when day is clicked. Signature: checked (bool), day data (object)
- **`start`**: first enabled day (format: YYYYMMDD)
- **`end`**: last enabled day (format: YYYYMMDD)

## Tests

To run tests (mocha & chai):

```
npm install && npm test
```

<br><br>

---

© 2014 [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/almanac/master/LICENSE)