'use strict'

/**
 * Normalizes the case and ordering of compound keys
 * @func    desensitize
 * @param   {string} keystring  The compound key to normalize
 * @returns {string}            The normalized compound key
 */
function desensitize (keystring) {
  const keys = keystring.split('+')

  if (keystring === '+') {
    return keystring
  }
  if (keystring.split('').pop() === '+') {
    keys.pop()
    keys.pop()
    keys.push('+')
  }

  const primaryKey = keys.pop()
  const keyArray = keys.map(str => str.toLowerCase()).sort()

  keyArray.push(primaryKey)

  return keyArray.join('+')
}

/**
 * Decorates KeyboardEvent.key to reflect whether Alt, Ctrl, or Meta
 * has been pressed. Shift is ignored, since e.key already accounts for it
 * @func    decorate
 * @param   {Object} event  A KeyboardEvent
 * @returns {string}        KeyboardEvent.key, decorated to reflect if peripheral keys were held
 */
function decorate (event) {
  let modifiers = ''

  if (event.altKey) {
    modifiers += 'alt+'
  }
  if (event.ctrlKey) {
    modifiers += 'ctrl+'
  }
  if (event.metaKey) {
    modifiers += 'meta+'
  }

  return modifiers + event.key
}

export {
  desensitize,
  decorate
}
