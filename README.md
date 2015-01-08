UniQL-JS
=======

This generates Javascript based on [UniQL](https://github.com/honeinc/uniql) ASTs.

## Example

```javascript
var parse = require( 'uniql' );
var jsCompile = require( 'uniql-js' );

var ast = parse( '( height <= 20 or ( favorites.color == "green" and height != 25 ) ) and firstname ~= "o.+"' );
var jsQuery = jsCompile( ast );
console.log( jsQuery );
```

Resulting query:

```
( height <= 20 || ( favorites.color == "green" && height != 25 ) ) && firstname.match( new RegExp( "o.+" ) )
```

## License

[MIT](LICENSE)
