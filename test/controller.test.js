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

let documentAddEventSpy
let documentRemoveEventSpy

// For some reason, Controller does not properly bind to the DOM in test env
// For now we'll manually attach the events instead, and try to find a fix in the future
function addEvents () {
  document.addEventListener('keydown', controller._handlers['keydown'])
  document.addEventListener('keyup', controller._handlers['keyup'])
}

function removeEvents () {
  document.removeEventListener('keydown', controller._handlers['keydown'])
  document.removeEventListener('keyup', controller._handlers['keyup'])
}

describe('controller maps commands to keyboard codes', () => {
  beforeEach(() => {
    myModel = {
      a: 'init'
    }
    virtuals = {
      inc: {
        keyup (model, e) {
          if (!e.shiftKey) {
            model.a = 'keyup inc'
          } else {
            model.a = 'keyup inc shift'
          }
        },
        keydown (model) {
          model.a = 'keydown inc'
        }
      },
      dec: {
        keydown (model) {
          model.a = 'keydown dec'
        }
      },
      reset: {
        keydown (model) {
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

    documentAddEventSpy = sinon.spy(document, 'addEventListener')
    documentRemoveEventSpy = sinon.spy(document, 'removeEventListener')

    addEvents()
  })

  afterEach(() => {
    removeEvents()
    documentAddEventSpy.restore()
    documentRemoveEventSpy.restore()
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

  it('should register events using document.addEventListener', () => {
    const documentDispatchSpy = sinon.spy(document, 'dispatchEvent')

    expect(documentAddEventSpy.calledWith('keyup', controller._handlers['keyup']))
    expect(documentAddEventSpy.calledWith('keydown', controller._handlers['keydown']))
    expect(documentRemoveEventSpy.called).to.be.false()

    keydownPress('w')

    const keyboardEvent = documentDispatchSpy.getCall(0).args[0]

    expect(documentDispatchSpy.calledOnce).to.be.true()
    expect(keyboardEvent.keyCode).to.equal(keycode('w'))
    expect(keyboardEvent.type).to.equal('keydown')
    expect(myModel.a).to.equal('keydown inc')
  })

  it('should call the appropriate handler', () => {
    keyupPress('w')
    expect(myModel.a).to.equal('keyup inc')

    keyupShiftPress('w')
    expect(myModel.a).to.equal('keyup inc shift')

    keydownPress('w')
    expect(myModel.a).to.equal('keydown inc')

    keydownPress('a')
    expect(myModel.a).to.equal('keydown dec')

    keydownPress('s')
    expect(myModel.a).to.equal('keydown reset')
  })

  it('should overwrite old controls when passed new controls', () => {
    removeEvents()

    controller.register({
      inc: 'q',
      dec: 'e',
      reset: 'd'
    })

    addEvents()

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
    removeEvents()
    keyupPress('w')
    expect(myModel.a).to.equal('init')

    controller.bind()
    addEvents()
    keyupPress('w')
    expect(myModel.a).to.equal('keyup inc')
  })
})
