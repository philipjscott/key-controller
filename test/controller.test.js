/* global describe, it, beforeEach, afterEach */

'use strict'

import Controller from '../lib/controller'
import { expect } from 'chai'
import { keypressDown, keypressUp, keypressUpShift } from './keypress'

let model
let commands
let controls
let controller

describe('controller maps commands to keyboard codes', () => {
  beforeEach(() => {
    model = {
      a: 'init'
    }
    commands = {
      keyup: {
        inc (model, e) {
          if (!e.shiftKey) {
            model.a = 'keyup inc'
          } else {
            model.a = 'keyup inc shift'
          }
        }
      },
      keydown: {
        inc (model) {
          model.a = 'keydown inc'
        },
        dec (model) {
          model.a = 'keydown dec'
        },
        reset (model) {
          model.a = 'keydown reset'
        }
      }
    }
    controls = {
      inc: 'w',
      dec: 'a',
      reset: 's'
    }
    controller = new Controller(model, commands)
    controller.register(controls)
  })

  afterEach(() => {
    controller.unbind()
  })

  it('should call the appropriate handler', () => {
    keypressUp('w')
    expect(model.a).to.equal('keyup inc')

    keypressUpShift('w')
    expect(model.a).to.equal('keyup inc shift')

    keypressDown('w')
    expect(model.a).to.equal('keydown inc')

    keypressDown('a')
    expect(model.a).to.equal('keydown dec')

    keypressDown('s')
    expect(model.a).to.equal('keydown reset')
  })

  it('should overwrite old controls when passed new controls', () => {
    controller.register({
      inc: 'q',
      dec: 'e',
      reset: 'd'
    })

    keypressUp('w')
    expect(model.a).to.equal('init')

    keypressUpShift('w')
    expect(model.a).to.equal('init')

    keypressDown('w')
    expect(model.a).to.equal('init')

    keypressDown('a')
    expect(model.a).to.equal('init')

    keypressDown('s')
    expect(model.a).to.equal('init')

    keypressUp('q')
    expect(model.a).to.equal('keyup inc')

    keypressUpShift('q')
    expect(model.a).to.equal('keyup inc shift')

    keypressDown('q')
    expect(model.a).to.equal('keydown inc')

    keypressDown('e')
    expect(model.a).to.equal('keydown dec')

    keypressDown('d')
    expect(model.a).to.equal('keydown reset')
  })

  it('should be able to bind and unbind the controller', () => {
    controller.unbind()
    keypressUp('w')
    expect(model.a).to.equal('init')

    controller.bind()
    keypressUp('w')
    expect(model.a).to.equal('keyup inc')
  })
})
