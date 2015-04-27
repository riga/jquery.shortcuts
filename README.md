# jQuery.Shortcuts

jQuery.Shortcuts lets you easily switch between sets of arbitrary and easy-to-define shortcuts. You can even manage the sets of shortcuts via namespaces.


## Dependencies

This jQuery plugin requires [John Resig's hotkeys plugin](https://github.com/jeresig/jquery.hotkeys) to be loaded.


## Example

##### Add and remove (global) shortcuts:

```javascript
// get the (global) shortcuts object
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
// register a new shortcuts object
var myTopSc = $.Shortcuts("top");

// when we disable the global namespace, all sub namespaces are also disabled
// e.g.: $.Shortcuts().disable();

// register another shortcuts object that belongs to "top"
var mySubSc = $.Shortcuts("top.sub");

console.log(mySubSc.parent() == myTopSc);
// => true

console.log(myTopSc.child("sub") == mySubSc);
// => true

```


##### Configuration

```javascript
// configure $.Shortcuts _before_ you create any instance
// (these are the default options)
$.Shortcuts({
    // name of the global namespace
    global: "global",

    // delimitter that separates namespaces
    delimitter: ".",

    // the default event type
    defaultEvent: "keydown",

    // the target
    target: document
});
```


## API

* **`$.Shortcuts([namespace|options])`**
    > If `options` are passed, the global options are extended and the `$.Shortcuts` object is returned. If a `namespace` is passed, a new shortcuts instance with that namespace is created and returned. When no argument is given, the global shortcuts object is returned. Parentage is built automatically. A namespace consists of a number of names seperated by a delimitter. Example: namespace `"foo.bar"` => shortcuts `"global"` -> shortcuts `"foo"` -> shortcuts `"bar"`. **Note** that the global namespace (`"global"` in this example) is always prepended.

* `namespace()`
    > Returns the `namespace`.
    
* `name()`
    > Returns the `name`.
    
* `parent()`
    > Returns the parent shortcuts, or `null` when invoked on the global shortcuts object.

* `children()`
    > Return all child shortcut objects mapped to their names.

* `child(name)`
    > Return a child shortcuts object given by `name`.

* `enabled()`
    > Returns the state.

* `enable()`
    > Enable the shorcuts. **Note** that in case the parent is disabled, _this_ shorcuts do not fire even if they are enabled!

* `disable()`
    > Disable the shortcuts. Please see the **note** in `enable()`.
    
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