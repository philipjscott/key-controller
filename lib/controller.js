'use strict'

import invert from './invert'
import rotate from './rotate'
import { decorate, desensitize } from './compound'

class Controller {
  /**
   * Create a Controller; caches model, virtuals, and options
   * @param {Object} model     The object passed and mutated in the virtuals
   * @param {Object} virtuals  A map of virtual keys to handlers, virtuals[keyname][event]
   */
  constructor (model, virtuals) {
    this._model = model
    this._virtuals = virtuals
    this._handlers = {}
  }

  /**
   * Binds keyboard controls to virtual keys
   * @param {Object} controls  A mapping of virtual keys to keyboard codes
   */
  register (controls) {
    const virtualsByEvent = rotate(this._virtuals)
    let keymap

    for (const virtual in controls) {
      if (Array.isArray(controls[virtual])) {
        controls[virtual] = controls[virtual].map(desensitize)
      } else {
        controls[virtual] = desensitize(controls[virtual])
      }
    }

    try {
      keymap = invert(controls)
    } catch (err) {
      throw new Error(`Cannot register controls; attempting to bind ${err} to multiple virtual keys`)
    }

    for (const event in virtualsByEvent) {
      const handler = (e) => {
        const fn = virtualsByEvent[event][keymap[decorate(e)]]
        const wildcardFn = virtualsByEvent[event]['_']

        if (fn) {
          fn(this._model, e)
        }
        if (wildcardFn) {
          wildcardFn(this._model, e)
        }
      }

      document.body.removeEventListener(event, this._handlers[event])
      document.body.addEventListener(event, handler)
      this._handlers[event] = handler
    }
  }

  /**
   * Unbinds the controller from the DOM
   */
  unbind () {
    for (const event in this._virtuals) {
      document.body.removeEventListener(event, this._handlers[event])
    }
  }

  /**
   * Binds the controller to the DOM
   */
  bind () {
    for (const event in this._virtuals) {
      document.body.removeEventListener(event, this._handlers[event])
    }
  }
}

export default Controller
