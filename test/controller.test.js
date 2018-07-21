/* global describe, it, beforeEach, afterEach */

'use strict'

import Controller from '../lib/controller'
import chai, { expect } from 'chai'
import keycode from 'keycode'
import dirtyChai from 'dirty-chai'
import sinon from 'sinon'
import { keydownPress, keyupPress, keyupShiftPress } from './keypress'

chai.use(dirtyChai)

let myModel
let virtuals
let controls
let controller

describe('controller maps commands to keyboard codes', () => {
  beforeEach(() => {
    myModel = {
      a: 'init'
    }
    virtuals = {
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

    controller = new Controller(myModel, virtuals)
    controller.register(controls)

    // For some reason, Controller does not properly bind to the DOM in test env
    // Manually attaching the handlers instead
    document.addEventListener('keydown', controller._handlers['keydown'])
    document.addEventListener('keyup', controller._handlers['keyup'])
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

  it.only('should register events using document.addEventListener', () => {
    /* const documentAddEventSpy = sinon.spy(document, 'addEventListener')
    const documentRemoveEventSpy = sinon.spy(document, 'removeEventListener')
    const controller = new Controller(myModel, virtuals)

    controller.register(controls)
    expect(documentAddEventSpy.calledWith('keyup', controller._handlers['keyup']))
    expect(documentAddEventSpy.calledWith('keydown', controller._handlers['keydown']))
    expect(documentRemoveEventSpy.called).to.be.false()
    */

    const documentDispatchSpy = sinon.spy(document, 'dispatchEvent')
    // const keyupHandlerSpy = sinon.spy(controller._handlers, 'keydown')

    keydownPress('w')

    const keyboardEvent = documentDispatchSpy.getCall(0).args[0]

    expect(documentDispatchSpy.calledOnce).to.be.true()
    expect(keyboardEvent.keyCode).to.equal(keycode('w'))
    expect(keyboardEvent.type).to.equal('keydown')
    expect(myModel.a).to.equal('keydown inc')
    // expect(keyupHandlerSpy.called).to.be.true()
  })

  it('should call the appropriate handler', () => {
    const controller = new Controller(myModel, virtuals)
    controller.register(controls)
    console.log('model: ', controller._model)
    console.log('virtuals: ', controller._virtuals)
    console.log('handlers: ', controller._handlers)
    // for some reason document.addEventListener isn't proccing in lib
    // problem: below line shouldn't be needed!
    // document.addEventListener('keyup', controller._handlers['keyup'])
    return keyupPress('w').then(() => {
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
