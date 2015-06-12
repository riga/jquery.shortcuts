/*!
 * jQuery Shortcuts Plugin v1.3.1
 * https://github.com/riga/jquery.shortcuts
 *
 * Copyright 2015, Marcel Rieger
 * MIT licensed
 * http://www.opensource.org/licenses/mit-license
 *
 * Dependencies:
 *     jQuery Hotkeys Plugin by John Resig:
 *     https://github.com/jeresig/jquery.hotkeys
 */

(function($) {

  /**
   * Store the global shortcut group.
   */

  var globalShortcuts;


  /**
   * Bookkeeping for mapping "key -> group" for
   * faster resolving priorities.
   */

  var keyGroupMap = {};


  /**
   * Default options.
   */

  var options = {
    // name of the global namespace
    global: "global",

    // delimitter that separates namespaces
    delimitter: ".",

    // the default event type
    defaultEvent: "keydown",

    // the target
    target: document,

    // apply priorities?
    priorities: false
  };


  /**
   * Helper function that prefixes a namespace with the global namespace.
   *
   * @param {string} namespace - The namespace to prefix.
   * @returns {string}
   */
  var prefixNamespace = function(namespace) {
    var prefix = options.global + options.delimitter;

    if (namespace === undefined || namespace == options.global) {
      return options.global;
    } else if (namespace.indexOf(prefix) != 0) {
      return prefix + namespace;
    } else {
      return namespace;
    }
  };


  /**
   * Helper function that returns a specific shortcut group for a given namespace.
   *
   * @param {string} namespace - Namespace of the shortcuts object.
   */
  var getShortcuts = function(namespace) {
    if (namespace === undefined) {
      return null;
    }

    // the global shortcut group needs to be setup
    if (!globalShortcuts) {
      return null;
    }

    // prefix the namespace
    namespace = prefixNamespace(namespace);

    // split the namespace by our delimitter
    var parts = namespace.split(options.delimitter);

    // remove the global namespace
    parts.shift();

    // recursive lookup in each shortcut group's subgroups
    var shortcuts = globalShortcuts;
    while (parts.length) {
      shortcuts = shortcuts.children()[parts.shift()];

      // error case
      if (!shortcuts) {
        break;
      }
    }

    return shortcuts;
  };


  /**
   * Helper function that returns the name of a shortcut group given its namespace.
   *
   * @param {string} namespace - The namespace of the shortcut group.
   * @returns {string}
   */
  var getShortcutsName = function(namespace) {
    if (namespace === undefined) {
      return null;
    }

    // prefix the namespace
    namespace = prefixNamespace(namespace);

    // the last part is the name
    return namespace.split(options.delimitter).pop();
  };


  /**
   * Helper functions that parses a key and returns helpful variables.
   *
   * @example
   * parseKey("meta+k");
   * -> { key: "meta+k", event: "keydown", cleanedKey: "keydown.metak" }
   * @param {string} key - The key to parse.
   * @returns {object}
   */
  var parseKey = function(key) {
    var event, cleanedKey;

    // first, get the event type, 
    var match = /^([a-zA-Z]+)\:.+$/.exec(key);
    if (!match) {
      event      = options.defaultEvent;
      cleanedKey = key;
    } else {
      event      = match[1];
      cleanedKey = key.substr(event.length + 1);
    }

    var id = event + "." + cleanedKey.replace(/\+/g, "");

    return {
      key  : cleanedKey,
      id   : id,
      event: event
    };
  };



  /**
   * Shortcuts definition.
   *
   * @param {string|object} [namespace=globalNamespace] - A string that defines the namespace of the
   *  new shortcuts. In that case, the global namespace will be prefixed and the created shortcut
   *  group is returned. When an object is passed, it is used to extend the default options and the
   *  main `Shortcuts` object is returned. Make sure to extend the options _before_ instantiating
   *  the first shortcut group.
   * @returns {shortcuts|Shortcuts}
   */
  $.Shortcuts = function(namespace) {

    // create shortcuts or extend default options
    if ($.isPlainObject(namespace)) {
      $.extend(options, namespace);

      return $.Shortcuts;
    }


    // prefix the global namespace
    namespace = prefixNamespace(namespace);


    // is there already a shortcut group with that namespace?
    var self = getShortcuts(namespace);

    if (self) {
      return self;
    }


    // define a new logger
    self = {
      // current state
      _enabled: false,

      // the namespace
      _namespace: namespace,

      // the name
      _name: getShortcutsName(namespace),

      // the priority
      _priority: 0,

      // parent shortcuts
      _parent: null,

      // child shortcuts
      _children: {},

      // callbacks are stored in jQuery.Callbacks objects, mapped to a key
      _callbacks: {},

      // name getter
      name: function() {
        return self._name;
      },

      // namespace getter
      namespace: function() {
        return self._namespace;
      },

      // priority getter/setter
      priority: function(priority) {
        if (priority === undefined) {
          return self._priority;
        } else {
          self._priority = priority;
        }
      },

      // parent getter
      parent: function() {
        return self._parent;
      },

      // children getter
      children: function() {
        return self._children;
      },

      // specific child getter
      child: function(name) {
        return self._children[name] || null;
      },

      // enabled getter
      enabled: function() {
        return self._enabled;
      },

      // enabled setters
      enable: function() {
        self._enabled = true;

        return self;
      },

      disable: function() {
        self._enabled = false;

        return self;
      },

      // determines whether handlers of this object can be fired
      // this depends on the current state and the activity of the parent
      _active: function() {
        return self.enabled() && (self.parent() == null || self.parent()._active());
      },

      // determines for an invoked key event whether the callback can be fired, i.e.
      // there's no other group listening for the key event with a higher priority
      _hasPrecedence: function(key) {
        var groups = keyGroupMap[key];

        if (!groups || groups.length == 0) {
          return true;
        }

        var highestPrio = Math.max.apply(Math, groups.map(function(group) {
          return group.priority();
        }));

        return self.priority() >= highestPrio;
      },

      // adds handlers for a key
      add: function(key) {
        var handlers = Array.prototype.slice.call(arguments, 1);

        // the callbacks object for this key is set only once
        if (!self._callbacks[key]) {
          var cbs = self._callbacks[key] = $.Callbacks();

          // create a wrapper that checks the activity before
          // invoking the callbacks
          cbs.shortcutHandler = function(event) {
            if (!self._active()) {
              return;
            }

            // handle priorities
            if (options.priorities && !self._hasPrecedence(key)) {
              return;
            }

            // prevent default?
            cbs.fire(event);
          };

          // actual event binding
          var data = parseKey(key);
          $(options.target).bind(data.id, data.key, cbs.shortcutHandler);
        }

        // add all handlers to the callbacks object
        self._callbacks[key].add(handlers);

        // store the info that _this_ group (self) listens to that key
        var groups = keyGroupMap[key] = keyGroupMap[key] || [];
        if (!~groups.indexOf(self)) {
          groups.push(self);
        }

        return self;
      },

      // remove handlers for a key
      // if no handlers are passed, all handlers for that key are removed
      remove: function(key) {
        var cbs = self._callbacks[key];

        // remove _this_ group (self) from the key group mapping
        var groups = keyGroupMap[key];
        if (groups) {
          var idx = groups.indexOf(self);
          if (~idx) {
            groups.splice(idx, 1);
          }
        }

        if (!self._callbacks[key]) {
          return self;
        }

        var handlers = Array.prototype.slice.call(arguments, 1);

        if (handlers.length > 0) {
          cbs.remove(handlers);
        } else {
          cbs.empty();
        }

        return self;
      },

      // remove all handlers for all keys
      empty: function() {
        for (var key in self._callbacks) {
          self.remove(key);
        }

        return self;
      },

      // options getter
      options: function() {
        return options;
      }
    };


    /**
     * Store the new shortcut group.
     */

    if (namespace == options.global) {
      globalShortcuts = self;

      // the global shortcuts are enabled by default
      self.enable();

    } else {
      // find the proper parent shortcuts
      var parts = namespace.split(options.delimitter);
      parts.pop();
      var parentNamespace = parts.join(options.delimitter);
      self._parent = getShortcuts(parentNamespace);

      // create if it does not exist yet
      if (!self._parent) {
        self._parent = $.Shortcuts(parentNamespace);
      }

      // add self to _parent
      self._parent._children[self.name()] = self;

      // enable if _parent is also enabled
      if (self._parent.enabled()) {
        self.enable();
      }
    }


    /**
     * Return the created group.
     */

    return self;
  };

})(jQuery);
