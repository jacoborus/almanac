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


## Example

### HTML

```html
<div id="myAlmanac"></div>
```

### JS

```js
// get a HTML element
var elem = document.getElementById( 'almanac' );

// or create one and insert when you want
// var elem = document.createElement( 'div' );

// then create a calendar
var cal = new Almanac( elem, {
	multi: true,
	showMonths: 2
});
```


<br><br>

---

© 2014 [jacoborus](https://github.com/jacoborus)

Released under [MIT License](https://raw.github.com/jacoborus/almanac/master/LICENSE)