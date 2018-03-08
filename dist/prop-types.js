// ======================================
//  Custom Component PropType Validators
// ======================================

import React from 'react';
import PropTypes from 'prop-types';

var invalidErr = function invalidErr(propName, componentName) {
    return new Error('An invalid \'' + propName + '\' prop value was provided in ' + componentName + '.');
};

var invalidTypeErr = function invalidTypeErr(propName, componentName, allowedTypes) {
    return new TypeError('Invalid prop ' + propName + ' supplied to ' + componentName + '. Expected type to be one of ' + allowedTypes + '.');
};

var requiredPropErr = function requiredPropErr(propName, componentName) {
    return new Error(propName + ' is marked as required (in ' + componentName + ').');
};

var createChainedValidator = function createChainedValidator(validator) {
    var chainedValidator = validator.bind(null, false);
    chainedValidator.isRequired = validator.bind(null, true);

    return chainedValidator;
};

/**
 * Returns a function that validates that a prop is required if the
 * condition function returns true
 *
 * @param {Function} condition
 * @param {Function} validator
 *
 * @returns {Function}
 */
export var isRequiredIf = function isRequiredIf(condition, validator) {
    return function (props, propName, componentName) {
        for (var _len = arguments.length, rest = Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
            rest[_key - 3] = arguments[_key];
        }

        var isRequired = condition(props, propName, componentName);

        if (isRequired && !props.hasOwnProperty(propName)) {
            return requiredPropErr(propName, componentName);
        }

        return validator.apply(undefined, [props, propName, componentName].concat(rest));
    };
};

/**
 * Returns a function that validates that the prop is not defined if any of
 * the exclusive props are already defined. The .isRequired chained validator
 * specifies that the prop is required if none of the exclusive props are defined
 *
 * @param {Array} exclusivePropNames
 * @param {PropTypes.validator} validator
 *
 * @returns {Function}
 */
export var isAllowedIfNone = function isAllowedIfNone() {
    var exclusivePropNames = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var defaultValidator = arguments[1];

    var validator = function validator(isRequired, props, propName, componentName) {
        for (var _len2 = arguments.length, rest = Array(_len2 > 4 ? _len2 - 4 : 0), _key2 = 4; _key2 < _len2; _key2++) {
            rest[_key2 - 4] = arguments[_key2];
        }

        var isSpecified = props.hasOwnProperty(propName);
        var isOtherExclusivePropSpecified = exclusivePropNames.some(function (prop) {
            return props.hasOwnProperty(prop);
        });

        if (isSpecified && isOtherExclusivePropSpecified) {
            return new Error(propName + ' is expected to be undefined since one of ' + exclusivePropNames + ' is already defined (in ' + componentName + ').');
        }

        if (isRequired && !isSpecified) {
            return requiredPropErr(propName, componentName);
        }

        return defaultValidator.apply(undefined, [props, propName, componentName].concat(rest));
    };

    return createChainedValidator(validator);
};

/**
 * Returns a function that validates that the prop's type matches one of the
 * component constructors or element type specified. If this validator is used
 * on the `children` prop, it validates that all child components pass validation.
 *
 * @param {Array} allowedTypes
 *
 * @returns {Function}
 */
export var isOneOfType = function isOneOfType() {
    var allowedTypes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

    var validator = function validator(isRequired, props, propName, componentName) {
        for (var _len3 = arguments.length, rest = Array(_len3 > 4 ? _len3 - 4 : 0), _key3 = 4; _key3 < _len3; _key3++) {
            rest[_key3 - 4] = arguments[_key3];
        }

        if (isRequired && !props.hasOwnProperty(propName)) {
            return requiredPropErr(propName, componentName);
        }

        if (propName === 'children') {
            var children = React.Children.toArray(props[propName]);
            return children.every(function (child) {
                return allowedTypes.includes(child.type);
            }) ? null : invalidTypeErr(propName, componentName, allowedTypes);
        }

        return PropTypes.shape({ type: PropTypes.oneOf(allowedTypes) }).apply(undefined, [props, propName, componentName].concat(rest));
    };

    return createChainedValidator(validator);
};

/**
 * Returns a function that validates that the prop passes the user defined condition.
 *
 * @param {Function} condition
 * @param {PropTypes.validator} defaultValidator
 *
 * @returns {Function}
 */
export var isValidIf = function isValidIf(condition, defaultValidator) {
    var validator = function validator(isRequired, props, propName, componentName) {
        for (var _len4 = arguments.length, rest = Array(_len4 > 4 ? _len4 - 4 : 0), _key4 = 4; _key4 < _len4; _key4++) {
            rest[_key4 - 4] = arguments[_key4];
        }

        if (!props.hasOwnProperty(propName)) {
            return isRequired ? requiredPropErr(propName, componentName) : defaultValidator.apply(undefined, [props, propName, componentName].concat(rest));
        }

        var isValid = condition(props, propName, componentName);

        if (!isValid) {
            return invalidErr(propName, componentName);
        }

        return defaultValidator.apply(undefined, [props, propName, componentName].concat(rest));
    };

    return createChainedValidator(validator);
};

/**
 * Returns a function that validates that the prop is a whole number
 *
 * @returns {Function}
 */
export var isWholeNumber = function isWholeNumber() {
    var condition = function condition(props, propName) {
        return props[propName] % 1 === 0;
    };
    return isValidIf(condition, PropTypes.number);
};

export default {
    isAllowedIfNone: isAllowedIfNone,
    isRequiredIf: isRequiredIf,
    isOneOfType: isOneOfType,
    isValidIf: isValidIf,
    isWholeNumber: isWholeNumber
};