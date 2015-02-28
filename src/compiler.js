'use strict';

module.exports = compile;

var generators = {
    "NUMBER": function( node ) {
        return node.arguments[ 0 ].indexOf( '.' ) !== -1 ? parseFloat( node.arguments[ 0 ] ) : parseInt( node.arguments[ 0 ], 10 );
    },
    "STRING": function( node ) {
        return '"' + node.arguments[ 0 ].replace( '"', '\\"' ) + '"';
    },
    "BOOLEAN": function( node ) {
        return node.arguments[ 0 ].toLowerCase() === 'true';
    },
    "PRIMITIVE": function( node ) {
        var value = node.arguments[ 0 ];
        switch ( value.toLowerCase() ) {
            case 'null':
                value = null;
                break;
            case 'undefined':
                value = undefined;
                break;
        }
        return value;
    },
    "SYMBOL": function( node ) {
        return '' + node.arguments[ 0 ];
    },
    
    "-": function( node ) {
        return -(_processNode( node.arguments[ 0 ] ));
    },
    "&&": function( node ) {
        var result = [];
        node.arguments.forEach( function( _node ) {
           result.push( _processNode( _node ) );
        } );
        return ' ' + result.join( ' && ' );
    },
    "||": function( node ) {
        var result = [];
        node.arguments.forEach( function( _node ) {
            result.push( _processNode( _node ) );
        } );
        return ' ' + result.join( ' || ' ); 
    },
    "IN": function( node ) {
        var value = _processNode( node.arguments[ 0 ] );
        var field = _processNode( node.arguments[ 1 ] );
        return ' ' + field + '.indexOf( ' + value + ' ) !== -1 ';
    },
    "!": function( node ) {
        return ' !' + _processNode( node.arguments[ 0 ] );
    },
    "==": function( node ) {
        var comparison = _extractComparison( node );
        return ' ' + _processNode( comparison.symbol ) + ' == ' + _processNode( comparison.value );
    },
    "!=": function( node ) {
        var comparison = _extractComparison( node );
        return ' ' + _processNode( comparison.symbol ) + ' != ' + _processNode( comparison.value );
    },
    "MATCH": function( node ) {
        var comparison = _extractComparison( node );
        return ' ' + _processNode( comparison.symbol ) + '.match( new RegExp( ' + _processNode( comparison.value ) + ' ) )';
    },
    "<": function( node ) {
        var comparison = _extractComparison( node );
        return ' ' + _processNode( comparison.symbol ) + ' < ' + _processNode( comparison.value );
    },    
    "<=": function( node ) {
        var comparison = _extractComparison( node );
        return ' ' + _processNode( comparison.symbol ) + ' <= ' + _processNode( comparison.value );
    },    
    ">": function( node ) {
        var comparison = _extractComparison( node );
        return ' ' + _processNode( comparison.symbol ) + ' > ' + _processNode( comparison.value );
    },    
    ">=": function( node ) {
        var comparison = _extractComparison( node );
        return ' ' + _processNode( comparison.symbol ) + ' >= ' + _processNode( comparison.value );
    },
    "EXPRESSION": function( node ) {
        var result = [];
        node.arguments.forEach( function( _node ) {
            result.push( _processNode( _node ) );
        } );
        return ' (' + result.join( ' ' ) + ') ';
    }
};

function _extractComparison( node ) {
    var symbol = null;
    var value = null;
    node.arguments.forEach( function( _node ) {
        if ( _node.type === 'SYMBOL' ) {
            if ( symbol ) {
                throw new Error( 'JS: You can only specify one symbol in a comparison.' );
            }
            symbol = _node;
        } else {
            if ( value ) {
                throw new Error( 'JS: You can only specify one value in a comparison.' );
            }
            value = _node;
        }
    } );

    if ( !( symbol && value ) ) {
        throw new Error( 'JS: Invalid comparison, could not find both symbol and value.' );
    }

    return {
        symbol: symbol,
        value: value
    };
}

function _processNode( node ) {
    if ( !( node.type in generators ) ) {
        throw new Error( 'invalid node type' );
    }
    
    return generators[ node.type ]( node );
}

function compile( tree ) {
    return _processNode( tree );
}