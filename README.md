# PropType Conditionals

[![npm version](https://img.shields.io/npm/v/prop-type-conditionals.svg?)](https://www.npmjs.com/package/prop-type-conditionals)
[![npm downloads](https://img.shields.io/npm/dt/prop-type-conditionals.svg)](https://www.npmjs.com/package/prop-type-conditionals)
[![npm downloads](https://img.shields.io/npm/dm/prop-type-conditionals.svg)](https://www.npmjs.com/package/prop-type-conditionals)

A React PropType utility library that consists of various custom proptype validators.

## Installation
```
$ npm install --save prop-type-conditionals
```



## Usage
You may import the individual validators as needed or you can import the entire module:

```js
// Import individual validator
import { isValidIf } from 'prop-type-conditionals'

// Import entire module
import conditionals from 'prop-type-conditionals'
```
---

### Methods
1. [isAllowedIfNone](#isallowedifnone)
1. [isOneOfType](#isoneoftype)
1. [isRequiredIf](#isrequiredif)
1. [isValidIf](#isvalidif)
1. [isWholeNumber](#iswholenumber)

---

#### `isAllowedIfNone`
Returns a function that validates that the prop is not defined if any of the exclusive props are already defined. The `.isRequired` chained validator specifies that the prop is required if none of the exclusive props are defined.

**@param** {Array[String]} exclusivePropNames

**@param** {PropTypes.validator} validator

```js
import { isAllowedIfNone } from 'prop-type-conditionals'

Component.propTypes = {
    foo: PropTypes.string,
    bar: PropTypes.string,
    baz: isAllowedIfNone(['foo', 'bar'], PropTypes.string),
}
```

---

#### `isOneOfType`
Returns a function that validates that the prop's type matches one of the component constructors or element type specified. If this validator is used on the `children` prop, it validates that all child components pass validation.

**@param** {Array} allowedTypes

```js
import { isOneOfType } from 'prop-type-conditionals'
import Foo from 'components/foo'
import Bar from 'components/bar'

Component.propTypes = {
    children: isOneOfType([Foo, Bar])
}
```

---

#### `isRequiredIf`
Returns a function that validates that a prop is required if the condition function returns `true`.

**@param** {Function} condition

**@param** {Function} validator

```js
import { isRequiredIf } from 'prop-type-conditionals'

const condition = (props, propName) => true

Component.propTypes = {
    foo: isRequiredIf(condition, PropTypes.string)
}
```

---

#### `isValidIf`
Returns a function that validates that the prop passes the user defined condition.

**@param** {Function} condition

**@param** {PropTypes.validator} defaultValidator

```js
import { isValidIf } from 'prop-type-conditionals'

const condition = (props, propName) => true

Component.propTypes = {
    foo: isValidIf(condition, PropTypes.string)
}
```

---

#### `isWholeNumber`
Returns a function that validates that the prop is a whole number

```js
import { isWholeNumber } from 'prop-type-conditionals'

Component.propTypes = {
    foo: isWholeNumber()
}
```
