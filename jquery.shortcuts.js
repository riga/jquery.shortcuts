/*!
 * jQuery Shortcuts Plugin v0.1
 * https://github.com/riga/jquery.shortcuts
 *
 * Copyright 2012, Marcel Rieger
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * http://www.opensource.org/licenses/mit-license
 * http://www.opensource.org/licenses/GPL-3.0
 *
 * Dependencies:
 *     jQuery Hotkeys Plugin by John Resig:
 *     https://github.com/jeresig/jquery.hotkeys
 */

// object cache
var _shortcuts = {};

jQuery.Shortcuts = function(id) {

    var self = id && _shortcuts[id];

    if(!self) {
        // callback storage for the given id
        var _callbacks = {},

        // add function, that processes arbitrary callbacks from the arguments
        add = function(key) {
            var args = jQuery.makeArray(arguments);
            args.shift();
            _callbacks[key] = (_callbacks[key] || jQuery.Callbacks()).add(args);
            return self;
        },

        // remove function, that processes arbitrary callbacks from the arguments
        remove = function(key) {
            if(!_callbacks[key]) {
                return;
            }
            var args = jQuery.makeArray(arguments);
            args.shift();
            if(!args.length) {
                _callbacks[key].empty();
            } else {
                _callbacks[key].remove(args);
            }
            return self;
        },

        empty = function() {
            _callbacks = {};
            return self;
        },

        // enable function
        // keys can be passed in the arguments
        enable = function() {
            var args = jQuery.makeArray(arguments);
            this.disable.apply(this, args);
            jQuery.each(_callbacks, function(key, callback) {
                if(args.length === 0 || jQuery.inArray(key, args) > -1) {
                    // use name spaces to use callbacks more than once
                    jQuery(document).bind('keydown.' + key.replace(/\+/g, ''), key, callback.fire);
                }
            });
            return self;
        },

        // disable function
        // keys can be passed in the arguments
        disable = function() {
            var args = jQuery.makeArray(arguments);
            jQuery.each(_callbacks, function(key, callback) {
                if(args.length === 0 || jQuery.inArray(key, args) > -1) {
                    // use namespaces to use callbacks more than once
                    jQuery(document).unbind('keydown.' + key.replace(/\+/g, ''), callback.fire);
                }
            });
            return self;
        };

        self = {
            add: add,
            remove: remove,
            empty: empty,
            enable: enable,
            disable: disable
        };

        if(id) {
            _shortcuts[id] = self;
        }
    }

    return self;
};