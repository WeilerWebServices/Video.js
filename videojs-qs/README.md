# videojs-qs

A wrapper for the [Node querystring module][node-qs] mimic provided by [rollup-plugin-node-builtins][rpnb] for Video.js-based players.

**Note:** Does not support the `querystring.escape` or `querystring.unescape` properties.

## Installation

```sh
npm install --save videojs-qs
```

## API

There are two ways to use this module/plugin to retrieve a querystring-ish object. There is no particular advantage or disadvantage to one or the other - use whichever makes the most sense in your use-case.

### `videojs.qs()` Method

Including this module will add the `qs` method to the `videojs` namespace. This is a function that returns a clone of the [Node querystring built-in module][node-qs].

```js
var qs = videojs.qs().parse(window.location.search.substr(1));
```

### `qs` Plugin

In addition to the `videojs.qs()` method, a plugin is added that registers a `qs()` method on every player instance. This method behaves identically to the `videojs.qs()` method.

```js
var qs = player.qs().parse(window.location.search.substr(1));
```

## querystring-ish Objects

The objects returned by the aforementioned API methods have the following methods available:

### `stringify()`

The general usage of this is to turn an object into a query string:

```js
qs.stringify({foo: 'bar', bop: [1, 2]}); // "foo=bar&bop=1&bop=2"
```

**Note:** This is also aliased as `encode()`.

### `parse()`

The general usage of this is to turn a query string into an object:

```js
qs.parse('foo=bar&bop=1&bop=2'); // {foo: 'bar', bop: [1, 2]}
```

**Note:** This is also aliased as `decode()`.

### `search`

_This property does not come from [the Rollup plugin][rpnb]!_

The `search` property is provided by videojs-qs as a convenient way to reach a pre-`parse`ed copy of the `window.location.search` value in the current page context.

For example, if `window.location.search` is `?foo=bar&bop=1&bop=2`, the `search` property will look like: `{foo: 'bar', bop: [1, 2]}`.

## License

Apache-2.0. Copyright (c) Brightcove, Inc.


[node-qs]: https://nodejs.org/api/querystring.html
[rpnb]: https://github.com/calvinmetcalf/rollup-plugin-node-builtins
[videojs]: http://videojs.com/
