'use strict'

/**
 * Rotates the inner and outer keys of a depth-2 JSON
 * Creates an inner key to rotate if no inner key exists
 * @func    rotate
 * @param   {Object} json                  JSON to rotate
 * @param   {Object} [keyFallback='inner'] Inner key to create if no inner key exists
 * @returns {Object}                       A copy of the original JSON with keys rotated
 */
function rotate (json, keyFallback = 'inner') {
  let rotated = {}

  for (const outer in json) {
    if (typeof json[outer] !== 'object') {
      if (!rotated[keyFallback]) {
        rotated[keyFallback] = {}
      }
      rotated[keyFallback][outer] = json[outer]
    } else {
      for (const inner in json[outer]) {
        if (!rotated[inner]) {
          rotated[inner] = {}
        }
        rotated[inner][outer] = json[outer][inner]
      }
    }
  }

  return rotated
}

export default rotate
