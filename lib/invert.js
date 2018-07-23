'use strict'

/**
 * Swaps JSON values with keys; assumes JSON is a bijection
 * Array values are destructured as keys in the inverted JSON
 * @func    invert
 * @param   {Object} json  JSON to invert
 * @throws  {type}         The duplicate value if the JSON is not a bijection
 * @returns {Object}       A copy of the original JSON with its keys and values inverted
 */
function invert (json) {
  let swapped = {}

  for (const key in json) {
    if (swapped[json[key]]) {
      throw json[key]
    } else {
      if (Array.isArray(json[key])) {
        json[key].forEach((value) => {
          swapped[value] = key
        })
      } else {
        swapped[json[key]] = key
      }
    }
  }

  return swapped
}

export default invert
