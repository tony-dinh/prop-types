// ======================================
//  Custom Component PropType Validators
// ======================================

import React from 'react'
import PropTypes from 'prop-types'

const invalidErr = (propName, componentName) => new Error(`An invalid '${propName}' prop value was provided in ${componentName}.`)

const invalidTypeErr = (propName, componentName, allowedTypes) => new TypeError(`Invalid prop ${propName} supplied to ${componentName}. Expected type to be one of ${allowedTypes}.`)

const requiredPropErr = (propName, componentName) => new Error(`${propName} is marked as required (in ${componentName}).`)

const createChainedValidator = (validator) => {
    const chainedValidator = validator.bind(null, false)
    chainedValidator.isRequired = validator.bind(null, true)

    return chainedValidator
}

/**
 * Returns a function that validates that a prop is required if the
 * condition function returns true
 *
 * @param {Function} condition
 * @param {Function} validator
 *
 * @returns {Function}
 */
export const isRequiredIf = (condition, validator) => {
    return (props, propName, componentName, ...rest) => {
        const isRequired = condition(props, propName, componentName)

        if (isRequired && !props.hasOwnProperty(propName)) {
            return requiredPropErr(propName, componentName)
        }

        return validator(props, propName, componentName, ...rest)
    }
}

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
export const isAllowedIfNone = (exclusivePropNames = [], defaultValidator) => {
    const validator = (isRequired, props, propName, componentName, ...rest) => {
        const isSpecified = props.hasOwnProperty(propName)
        const isOtherExclusivePropSpecified = exclusivePropNames.some((prop) => props.hasOwnProperty(prop))

        if (isSpecified && isOtherExclusivePropSpecified) {
            return new Error(`${propName} is expected to be undefined since one of ${exclusivePropNames} is already defined (in ${componentName}).`)
        }

        if (isRequired && !isSpecified && !isOtherExclusivePropSpecified) {
            return requiredPropErr(propName, componentName)
        }

        return defaultValidator(props, propName, componentName, ...rest)
    }

    return createChainedValidator(validator)
}

/**
 * Returns a function that validates that the prop's type matches one of the
 * component constructors or element type specified. If this validator is used
 * on the `children` prop, it validates that all child components pass validation.
 *
 * @param {Array} allowedTypes
 *
 * @returns {Function}
 */
export const isOneOfType = (allowedTypes = []) => {
    const validator = (isRequired, props, propName, componentName, ...rest) => {
        if (isRequired && !props.hasOwnProperty(propName)) {
            return requiredPropErr(propName, componentName)
        }

        if (propName === 'children') {
            const children = React.Children.toArray(props[propName])
            return children.every((child) => allowedTypes.includes(child.type))
                ? null
                : invalidTypeErr(propName, componentName, allowedTypes)
        }

        return PropTypes.shape({type: PropTypes.oneOf(allowedTypes)})(props, propName, componentName, ...rest)
    }

    return createChainedValidator(validator)
}

/**
 * Returns a function that validates that the prop passes the user defined condition.
 *
 * @param {Function} condition
 * @param {PropTypes.validator} defaultValidator
 *
 * @returns {Function}
 */
export const isValidIf = (condition, defaultValidator) => {
    const validator = (isRequired, props, propName, componentName, ...rest) => {
        if (!props.hasOwnProperty(propName)) {
            return isRequired
                ? requiredPropErr(propName, componentName)
                : defaultValidator(props, propName, componentName, ...rest)
        }

        const isValid = condition(props, propName, componentName)

        if (!isValid && props.hasOwnProperty(propName)) {
            return invalidErr(propName, componentName)
        }

        return defaultValidator(props, propName, componentName, ...rest)
    }

    return createChainedValidator(validator)
}

/**
 * Returns a function that validates that the prop is a whole number
 *
 * @returns {Function}
 */
export const isWholeNumber = () => {
    const condition = (props, propName) => props[propName] % 1 === 0
    return isValidIf(condition, PropTypes.number)
}

export default {
    isAllowedIfNone,
    isRequiredIf,
    isOneOfType,
    isValidIf,
    isWholeNumber
}
