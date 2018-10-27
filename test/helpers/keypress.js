/* global KeyboardEvent */

'use strict'

function keyPress (key, eventType, options = {}) {
  const eventInit = Object.assign({}, { key }, options)
  const event = new KeyboardEvent(eventType, eventInit)

  document.dispatchEvent(event)
}

export default {
  press: {
    up (key) {
      keyPress(key, 'keyup')
    },
    down (key) {
      keyPress(key, 'keydown')
    }
  },
  altPress: {
    up (key) {
      keyPress(key, 'keyup', {
        altKey: true
      })
    },
    down (key) {
      keyPress(key, 'keydown', {
        altKey: true
      })
    }
  }
}
