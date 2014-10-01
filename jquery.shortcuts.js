/*!
 * jQuery Shortcuts Plugin v1.0.3
 * https://github.com/riga/jquery.shortcuts
 *
 * Copyright 2014, Marcel Rieger
 * Dual licensed under the MIT or GPL Version 3 licenses.
 * http://www.opensource.org/licenses/mit-license
 * http://www.opensource.org/licenses/GPL-3.0
 *
 * Dependencies:
 *     jQuery Hotkeys Plugin by John Resig:
 *     https://github.com/jeresig/jquery.hotkeys
 */

(function($) {

  var GLOBAL_NAMESPACE, DELIMITER, DEFAULT_TARGET,
      globalShortcuts,
      checkGlobalNS, getParentId, getShortcuts,
      Shortcuts;


  // some constants
  GLOBAL_NAMESPACE = "global";
  DELIMITER        = ".";
  DEFAULT_TARGET   = document;


  // the global shortcuts object
  globalShortcuts = null;


  // simple helper functions
  checkGlobalNS = function(id) {
    if (!id) {
      return null;
    } else if (id == GLOBAL_NAMESPACE) {
      return id;
    } else if (id.indexOf(GLOBAL_NAMESPACE + DELIMITER) != 0) {
      return GLOBAL_NAMESPACE + DELIMITER + id;
    } else {
      return id;
    }
  };

  getParentId = function(id, n) {
    n  = n == null ? 1 : n;

    id = checkGlobalNS(id);
    if (!id) {
      return null;
    }

    var parts = id.split(DELIMITER);
    if (n > parts.length - 1) {
      return null;
    }

    return parts.slice(0, -1 * n).join(DELIMITER);
  };

  getShortcuts = function(id) {
    id = checkGlobalNS(id);
    if (!id) {
      return null;
    }

    var parts     = id.split(DELIMITER).slice(1);
    var shortcuts = globalShortcuts;

    while (parts.length) {
      shortcuts = shortcuts.child(parts.shift());
      if (!shortcuts) {
        break;
      }
    }

    return shortcuts;
  };


  // our main callable
  Shortcuts = function(id) {
    // when no id is passed, use the global namespace
    id = id || GLOBAL_NAMESPACE;

    // prepend the global namespace
    id = checkGlobalNS(id);

    // get shortcuts object from store or create new one
    var self = getShortcuts(id);
    if (self) {
      return self;
    }

    // the name of this Shortcuts object
    var name = id.split(DELIMITER).pop();

    // the targets
    var targets = Array.prototype.slice.call(arguments, 1);
    if (!targets.length) {
      targets.push(DEFAULT_TARGET);
    }

    // create the parent shortcut object
    var parent   = null;
    var parentId = getParentId(id);
    if (parentId) {
      parent = getShortcuts(parentId) || arguments.callee(parentId);
    }

    // store child shortcuts
    var children = {};

    // all shortcut callbacks are stored in jQuery.Callbacks objects
    var callbacks = {};

    // enabled status, false by default
    var enabled = false;

    // create a new shortcuts object
    self = {
      // return the id
      id: function() {
        return id;
      },

      // return the name
      name: function() {
        return name;
      },

      // return the parent shortcuts object
      parent: function() {
        return parent;
      },

      // return a child shortcuts object
      child: function(name) {
        return children[name];
      },

      // return all children, mapped to their names
      children: function() {
        return children;
      },

      // adds a child, only for internal usage
      _addChild: function(child, name) {
        children[name] = child;
        return self;
      },

      // add arbitrary shortcuts handlers for a key
      add: function(key) {
        var handlers = Array.prototype.slice.call(arguments, 1);

        // $.Callbacks object set?
        if (!callbacks[key]) {
          callbacks[key] = $.Callbacks();
          callbacks[key].shortcutHandler = function(event) {
            // prevent default?
            callbacks[key].fire(event);
          };
        }

        callbacks[key].add(handlers);

        return self;
      },

      // remove shortcuts handlers for a key
      // if not handlers are passed, all handlers are removed for that keys
      remove: function(key) {
        if (!callbacks[key]) {
          return self;
        }

        var handlers = Array.prototype.slice.call(arguments, 1);

        if (!handlers.length) {
          callbacks[key].empty();
        } else {
          callbacks[key].remove(handlers);
        }

        return self;
      },

      // remove all shortcut handlers for all keys
      empty: function() {
        Object.keys(callbacks).forEach(function(key) {
          delete callbacks[key];
        });

        return self;
      },

      enable: function() {
        if (!enabled) {
          // enable our own shortcuts
          Object.keys(callbacks).forEach(function(key) {
            var handler    = callbacks[key].shortcutHandler;
            var cleanedKey = key.replace(/\+/g, "");

            targets.forEach(function(target) {
              $(target).bind("keydown." + cleanedKey, key, handler);
            });
          });

          // set the enabled state
          enabled = true;
        }

        // enable all children
        Object.keys(children).forEach(function(name) {
          children[name].enable();
        });

        return self;
      },

      disable: function() {
        if (enabled) {
          // disable our own shortcuts
          Object.keys(callbacks).forEach(function(key) {
            var handler    = callbacks[key].shortcutHandler;
            var cleanedKey = key.replace(/\+/g, "");

            targets.forEach(function(target) {
              $(target).unbind("keydown." + cleanedKey, handler);
            });
          });

          // set the enabled state
          enabled = false;
        }

        // disable all children
        Object.keys(children).forEach(function(name) {
          children[name].disable.call(null, targets);
        });

        return self;
      },

      enabled: function() {
        return enabled;
      },

      targets: function() {
        return targets;
      }
    };

    // tell the parent about ourself
    if (parent) {
      parent._addChild(self, name);
    }

    // enable, if our parent is enabled
    if (parent && parent.enabled()) {
      self.enable();
    }

    return self;
  };


  // create the global shortcuts object once
  if (!globalShortcuts) {
    globalShortcuts = Shortcuts(GLOBAL_NAMESPACE);
  }


  // add Shortcuts to jQuery
  $.Shortcuts = Shortcuts;

})(jQuery);
