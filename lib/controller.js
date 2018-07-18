'use strict'

import invert from './invert'
import keycode from 'keycode'

class Controller {
  /**
   * Create a Controller; caches model, commands, and options
   * @param {Object} model     The object passed and mutated in the commands
   * @param {Object} commands  A map of virtual keys to handlers
   */
  constructor (model, commands) {
    this._model = model
    this._commands = commands
    this._handlers = {}
  }

  /**
   * Binds keyboard controls to commands, which are invoked when option.event occurs
   * @param {Object} controls  A mapping from keyboard codes to command names
   */
  register (controls) {
    let keymap

    try {
      keymap = invert(controls)
    } catch (err) {
      throw new Error(`Cannot register controls; attempting to bind ${err} to multiple commands`)
    }

    for (const event in this._commands) {
      const handler = (e) => {
        const fn = this._commands[event][keymap[keycode(e)]]

        if (fn) {
          fn(this._model, e)
        }
      }

      document.body.addEventListener(event, handler)
      document.body.removeEventListener(event, this._handlers[event])
      this._handlers[event] = handler
    }
  }
}

export default Controller
