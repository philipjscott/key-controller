'use strict'

/**
 * Rotates the inner and outer keys of a depth-2 JSON
 * @func    invert
 * @param   {Object} json  JSON to rotate
 * @returns {Object}       A copy of the original JSON with keys rotated
 */
function rotate (json) {
  let rotated = {}

  for (const outer in json) {
    for (const inner in json[outer]) {
      if (!rotated[inner]) {
        rotated[inner] = {}
      }
      rotated[inner][outer] = json[outer][inner]
    }
  }

  return rotated
}

export default rotate
