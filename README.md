# jQuery.Shortcuts

jQuery.Shortcuts lets you easily switch between sets (groups) of arbitrary and easy-to-define shortcuts. You can even manage parentage of shortcut groups via namespaces.


## Dependencies

This jQuery plugin requires [John Resig's hotkeys plugin](https://github.com/jeresig/jquery.hotkeys) to be loaded.


## Examples

##### Configuration

```javascript
// configure $.Shortcuts _before_ you create any group
// (these are the default options)
$.Shortcuts({
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
});
```


##### Add and remove (global) shortcuts:

```javascript
// get the (global) shortcut group
var sc = $.Shortcuts();

// add a handler for ctrl+h
var handler = function(event) {
	// some nifty action
};
sc.add("ctrl+h", handler);

// remove the handler
sc.remove("ctrl+h", handler);

```


##### Handle shortcut parentage using namespaces:

```javascript
// register a new shortcut group
var myTopSc = $.Shortcuts("top");

// when we disable the global namespace, all sub namespaces are also disabled
// e.g.: $.Shortcuts().disable();

// register another group that belongs to "top"
var mySubSc = $.Shortcuts("top.sub");

console.log(mySubSc.parent() == myTopSc);
// => true

console.log(myTopSc.child("sub") == mySubSc);
// => true
```


##### Using priorities

```javascript
// configure the plugin
$.Shortcuts({ priorities: true });

// register two shortcut groups
var sc1 = $.Shortcuts("one");
var sc2 = $.Shortcuts("two");

// create and apply a handler for the same key event
var handler = function(event) {
	// do sth here
};
sc1.add("ctrl+h", handler);
sc2.add("ctrl+h", handler);

// assign a higher priority for sc2 (default is 0)
sc2.priority(10);

//
// no, when ctrl+h is pressed, only sc2 fires
//
```


## API

* **`$.Shortcuts([namespace|options])`**
    > If `options` are passed, the global options are extended and the `$.Shortcuts` object is returned. If a `namespace` is passed, a new shortcuts instance/group with that namespace is created and returned. When no argument is given, the global shortcut group is returned. Parentage is built automatically. A namespace consists of a number of names seperated by a delimitter. Example: namespace `"foo.bar"` => shortcuts `"global"` -> shortcuts `"foo"` -> shortcuts `"bar"`. **Note** that the global namespace (`"global"` in this example) is always prepended.

* `namespace()`
    > Returns the `namespace`.
    
* `name()`
    > Returns the `name`.
    
* `parent()`
    > Returns the parent shortcuts, or `null` when invoked on the global shortcut group.

* `children()`
    > Return all child shortcut groups mapped to their names.

* `child(name)`
    > Return a child shortcut group given by `name`.

* `enabled()`
    > Returns the state.

* `enable()`
    > Enable the shorcuts. **Note** that in case the parent is disabled, _this_ shorcuts do not fire even if they are enabled!

* `disable()`
    > Disable the shortcuts. Please see the **note** in `enable()`.
    
* `priority([priority])`
	> When `priority` is given, the priority is set to that value. Otherwise, the current priority is returned. **Note** that priorities are only applied, when the `priorities` option is set to `true`.
    
* `add(key, [handler1], [handler2], [...])`
	> Add handlers for a shortcut given by `key`. See [John Resig's hotkeys plugin](https://github.com/jeresig/jquery.hotkeys) for more information on the format. As of version 1.1.0, you can prepend the desired event type to your key using the colon character, e.g. `keydown:ctrl+a`. `keydown` is the default. Other valid events are `keyup` and `keypress`.

* `remove(key, [handler1], [handler2], [...])`
	> Remove handlers for a shortcut given by `key`. If no handlers are given, remove all handlers for that `key`.

* `empty()`
	> Remove all handlers for all keys.

* `options()`
    > Returns the current options.


# Development

- Source hosted at [GitHub](https://github.com/riga/jquery.shortcuts)
- Report issues, questions, feature requests on
[GitHub Issues](https://github.com/riga/jquery.shortcuts/issues)


# Authors

Marcel R. ([riga](https://github.com/riga))