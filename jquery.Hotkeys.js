/*!
 * jQuery Hotkeys Plugin v0.1
 * https://github.com/riga/jquery.Hotkeys
 *
 * Copyright 2012, Marcel Rieger
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * http://www.opensource.org/licenses/mit-license
 * http://www.opensource.org/licenses/GPL-3.0
 *
 * Dependencies:
 *		jQuery Hotkeys Plugin by John Resig:
 * 		https://github.com/jeresig/jquery.hotkeys
 */

// object cache
var _hotkeys = {};

jQuery.Hotkeys = function( /*String|Integer*/ id ) {
	// instantiated on every call
	
	var self = id && _hotkeys[ id ];
	
	if ( !self ) {
		// callback storage for the given id
		var _callbacks = {},
		
		// add function, that processes arbitrary callbacks from the arguments
		add = function( /*String*/ key ) {
			var args = jQuery.makeArray( arguments );
			args.shift();
			_callbacks[ key ] = ( _callbacks[key] || jQuery.Callbacks() ).add( args );
			return this;
		},
		
		// remove function, that processes arbitrary callbacks from the arguments
		remove = function( /*String*/ key ) {
			if ( !_callbacks[ key ] ) {
				return;
			}
			var args = jQuery.makeArray( arguments );
			args.shift();
			if ( args.length === 0 ) {
				_callbacks[ key ].empty();
			} else {
				_callbacks[ key ].remove( args );
			}
			return this;
		},
		
		// enable function
		// keys can be passed in the arguments
		enable = function() {
			var args = jQuery.makeArray( arguments );
			this.disable.apply( this, args );
			jQuery.each( _callbacks, function( key, callback ) {
				if ( args.length === 0 || jQuery.inArray( key, args ) > -1 ) {
					// use name spaces to use callbacks more than once
					jQuery(document).bind( 'keydown.' + key.replace( /\+/g, '' ), key, callback.fire );
				}
			});
			return this;
		},
		
		// disable function
		// keys can be passed in the arguments
		disable = function() {
			var args = jQuery.makeArray( arguments );
			jQuery.each( _callbacks, function( key, callback ) {
				if ( args.length === 0 || jQuery.inArray( key, args ) > -1 ) {
					// use name sapces to use callbacks more than once
					jQuery(document).unbind( 'keydown.' + key.replace( /\+/g, '' ), callback.fire );
				}
			});
			return this;
		},
		
		// _callbacks getter with 'key' filter
		callbacks = function( /*String*/ key ) {
			return key ? _callbacks[ key ] : _callbacks;
		};
		
		self = {
			// functions
			add: add,
			remove: remove,
			enable: enable,
			disable: disable,
			// getter
			callbacks: callbacks
		};
		
		if ( id ) {
			_hotkeys[ id ] = self;
		}
	}
	
	return self;
};