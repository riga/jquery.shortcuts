# jQuery.Shortcuts

jQuery.Shortcuts lets you easily switch between sets of arbitrary and easy-to-define shortcuts. You can even manage the sets of shortcuts via namespaces.


## Dependencies

This jQuery plugin requires [John Resig's hotkeys plugin](https://github.com/jeresig/jquery.hotkeys) to be loaded.


## Example

##### Add and remove (global) shortcuts:

```javascript
// get the (global) shortcuts object and enable it
var sc = $.Shortcuts().enable();

// add a handler for ctrl+h
var handler = function(event) {
	// some nifty action
};
sc.add("ctrl+h", handler);

// remove the handler
sc.remove("ctrl+h", handler);

```


##### Handle sets and subsets of shortcuts using namespaces:

```javascript
// register and enable a new shortcuts object
var myTopSc = $.Shortcuts("top").enable();

// when we disable the global namespace, all sub namespaces are also disabled
// e.g.: $.Shortcuts().disable();

// register another shortcuts objet that belongs to "top"
// there's no need to enable it, since we already enabled "top"
var mySubSc = $.Shortcuts("top.sub");

console.log(mySubSc.parent() == myTopSc);
// => true

console.log(myTopSc.child("sub") == mySubSc);
// => true

```


## API

* **`$.Shortcuts([id], [target1], [target2], [...])`**
	> Returns a Shortcuts object. If `id` is empty, the global namespace is used. Otherwise, a new Shortcuts
	object will the created, that is a child of the global object. This also works when passing an `id` that
	implies namespaces. E.g. `$.Shortcuts("a.b.c")` recursively creates Shortcuts objects `"a"` and `"b"` and
	returns a Shortcuts object named `"c"`. `targets` are the DOM nodes that receive the handlers via
	`bind`/`unbind`. If no `target` is given, `document` is used instead.

* `id()`
	> Returns the `id`. E.g. `$.Shortcuts("a.b.c").id()` will give `"global.a.b.c"`.
	
* `name()`
	> Returns the `name`. E.g. `$.Shortcuts("a.b.c").id()` will give `"c"`.
	
* `parent()`
	> Returns the parent, or `null` for the global object.
	
* `child(name)`
	> Return a child given by `name`.

* `children()`
	> Return a children, mapped to their names.

* `add(key, [handler1], [handler2], [...])`
	> Add handlers for a shortcut given by `key`. See [John Resig's hotkeys plugin](https://github.com/jeresig/jquery.hotkeys) for more information on the format.

* `remove(key, [handler1], [handler2], [...])`
	> Remove handlers for a shortcut given by `key`. If no handlers are given, remove all handlers for that
	`key`.

* `empty()`
	> Remove all handlers for all keys.

* `enable()`
	> Enable all handlers and call `enable()` for all children.

* `disable()`
	> Disable all handlers and call `disable()` for all children.

* `enabled()`
	> Returns `true` (`false`) if the Shortcuts object is enabled (disabled).
	
* `targets()`
	> Returns an array containing all `targets` passed in the _constructor_.


# Development

- Source hosted at [GitHub](https://github.com/riga/jquery.shortcuts)
- Report issues, questions, feature requests on
[GitHub Issues](https://github.com/riga/jquery.shortcuts/issues)


# Authors

Marcel R. ([riga](https://github.com/riga))