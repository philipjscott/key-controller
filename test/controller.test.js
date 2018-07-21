/* global describe, it, beforeEach, afterEach */

'use strict'

import Controller from '../lib/controller'
import { expect } from 'chai'
import { keydownPress, keyupPress, keyupShiftPress } from './keypress'

let myModel
let commands
let controls
let controller

describe('controller maps commands to keyboard codes', () => {
  beforeEach(() => {
    myModel = {
      a: 'init'
    }
    commands = {
      keyup: {
        inc (model, e) {
          console.log('called')
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
    controller = new Controller(myModel, commands)
    controller.register(controls)
  })

  afterEach(() => {
    controller.unbind()
  })

  describe('headless chrome DOM', () => {
    it('should be able to register an event and call the handler', () => {
      let model = 0
      const handler = () => {
        model = 1
      }
      const eventType = 'keyup'

      document.addEventListener(eventType, handler)
      keyupPress('w')
      expect(model).to.equal(1)
      document.removeEventListener(eventType, handler)
    })
  })

  it.only('should call the appropriate handler', async () => {
    keyupPress('w').then(() => {
      // possible race issue: keyup calls the handler, but handler may not finish in time
      // make keyPress by an async function; await
      console.log('done', myModel.a)
      expect(myModel.a).to.equal('keyup inc')
    })

      /*
    keyupShiftPress('w')
    expect(myModel.a).to.equal('keyup inc shift')

    keydownPress('w')
    expect(myModel.a).to.equal('keydown inc')

    keydownPress('a')
    expect(myModel.a).to.equal('keydown dec')

    keydownPress('s')
    expect(myModel.a).to.equal('keydown reset')
      */
  })

  it('should overwrite old controls when passed new controls', () => {
    controller.register({
      inc: 'q',
      dec: 'e',
      reset: 'd'
    })

    keyupPress('w')
    expect(myModel.a).to.equal('init')

    keyupShiftPress('w')
    expect(myModel.a).to.equal('init')

    keydownPress('w')
    expect(myModel.a).to.equal('init')

    keydownPress('a')
    expect(myModel.a).to.equal('init')

    keydownPress('s')
    expect(myModel.a).to.equal('init')

    keyupPress('q')
    expect(myModel.a).to.equal('keyup inc')

    keyupShiftPress('q')
    expect(myModel.a).to.equal('keyup inc shift')

    keydownPress('q')
    expect(myModel.a).to.equal('keydown inc')

    keydownPress('e')
    expect(myModel.a).to.equal('keydown dec')

    keydownPress('d')
    expect(myModel.a).to.equal('keydown reset')
  })

  it('should be able to bind and unbind the controller', () => {
    controller.unbind()
    keyupPress('w')
    expect(myModel.a).to.equal('init')

    controller.bind()
    keyupPress('w')
    expect(myModel.a).to.equal('keyup inc')
  })
})
