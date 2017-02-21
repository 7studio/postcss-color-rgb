# PostCSS Color Rgb [![Build Status][ci-img]][ci]

[PostCSS] plugin to transform new [RGB functions](https://drafts.csswg.org/css-color/#rgb-functions) syntaxes to compatible CSS.

Find more information about these changes in ["CSS Function Syntaxes (color and otherwise)"](http://www.xanthir.com/b4iW0) by Tab Atkins Jr.

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/7studio/postcss-color-rgb.svg
[ci]:      https://travis-ci.org/7studio/postcss-color-rgb

```css
.foo {
  color: rgb(255 0 0);
}

.bar {
  color: rgb(255 0 0 / 40%);
}

.baz {
  color: rgba(255, 0, 0, 40%);
}
```

```css
.foo {
  color: rgb(255, 0, 0);
}

.bar {
  color: rgba(255, 0, 0, 0.4);
}

.baz {
  color: rgba(255, 0, 0, 0.4);
}
```

Checkout [tests](index.test.js) for more examples.

## Usage

```js
postcss([ require('postcss-color-rgb') ])
```

See [PostCSS] docs for examples for your environment.
