'use strict'

import test from 'ava'
import Controller from '../lib/controller'
import key from './helpers/keypress'

class Counter {
  constructor () {
    this.count = 0
  }

  reset () {
    this.count = 0
  }

  inc () {
    this.count += 1
  }

  dec () {
    this.count -= 1
  }

  invert () {
    this.count *= -1
  }

  get () {
    return this.count
  }
}

// For some reason, Controller does not properly bind to dom in test env
// For now we'll manually attach the events instead, and try to find a fix in the future
function adhocListen (controller) {
  const register = controller.register.bind(controller)
  const bind = controller.bind.bind(controller)
  const unbind = controller.unbind.bind(controller)

  controller.unbind = function () {
    unbind()
    teardown(this)
  }
  controller.bind = function () {
    bind()
    document.addEventListener('keydown', controller._handlers['keydown'])
    document.addEventListener('keyup', controller._handlers['keyup'])
  }
  controller.register = function (controls) {
    this.unbind()
    register(controls)
    this.bind()
  }

  return controller
}

function setup (gen) {
  const defaultGenerator = counter => ({
    inc () {
      counter.inc()
    },
    dec () {
      counter.dec()
    },
    reset () {
      counter.reset()
    },
    invert: {
      keyup () {
        counter.invert()
      },
      keydown () {
        counter.invert()
      }
    }
  })
  const controls = {
    inc: 'p',
    dec: 'o',
    reset: 'alt+r',
    invert: 'i'
  }

  const generator = gen || defaultGenerator
  const counter = new Counter()
  const controller = adhocListen(new Controller(generator, counter))

  controller.register(controls)

  return { controller, counter }
}

function teardown (controller) {
  document.removeEventListener('keydown', controller._handlers['keydown'])
  document.removeEventListener('keyup', controller._handlers['keyup'])
}

test('setup-browser-env', t => {
  let pass = false
  const handler = () => {
    pass = true
  }

  document.addEventListener('keydown', handler)

  key.press.down('w')
  t.is(pass, true)

  document.removeEventListener('keydown', handler)
})

test('implicit keydown', t => {
  const { controller, counter } = setup()

  key.press.down('p')
  t.is(counter.get(), 1)

  teardown(controller)
})

test('implicit keydown with a peripheral key', t => {
  const { controller, counter } = setup()

  key.press.down('p')
  t.is(counter.get(), 1)

  key.altPress.down('r')
  t.is(counter.get(), 0)

  teardown(controller)
})

test('bind and unbind', t => {
  const { controller, counter } = setup()

  controller.unbind()
  key.press.down('p')
  t.is(counter.get(), 0)

  controller.bind()
  key.press.down('p')
  t.is(counter.get(), 1)

  teardown(controller)
})

test('registers new controls', t => {
  const { controller, counter } = setup()
  const controls = {
    inc: 'g'
  }

  controller.register(controls)

  key.press.down('p')
  t.is(counter.get(), 0)

  key.press.down('g')
  t.is(counter.get(), 1)

  key.press.down('o')
  t.is(counter.get(), 1)

  teardown(controller)
})

test('handles multiple conrete keys bound to a virtual key', t => {
  const { controller, counter } = setup()
  const controls = {
    inc: ['w', 'ArrowUp']
  }

  controller.register(controls)

  key.press.down('w')
  t.is(counter.get(), 1)

  key.press.down('ArrowUp')
  t.is(counter.get(), 2)

  teardown(controller)
})

test('explicit keyup and keydown', t => {
  const { controller, counter } = setup()

  key.press.down('p')
  key.press.down('i')
  t.is(counter.get(), -1)

  key.press.down('i')
  t.is(counter.get(), 1)

  teardown(controller)
})

// TODO: Do we want to enforce this limitation?
test('prevents the same concrete key to be bound to multiple virtuals keys', t => {
  const { controller } = setup()
  const controls = {
    inc: 'w',
    dec: 'w'
  }

  try {
    controller.register(controls)

    t.fail()
  } catch (e) {
    t.is(e.message, 'Cannot register controls; attempting to bind w to multiple virtual keys')
  }

  teardown(controller)
})

test('wildcard virtual', t => {
  const generator = model => ({
    _: {
      keydown () {
        model.inc()
      },
      keyup () {
        model.dec()
      }
    }
  })
  const { controller, counter } = setup(generator)

  key.press.down('o')
  key.press.down('a')
  t.is(counter.get(), 2)

  key.press.up('p')
  key.press.up('d')
  key.press.up('b')
  t.is(counter.get(), -1)

  teardown(controller)
})
