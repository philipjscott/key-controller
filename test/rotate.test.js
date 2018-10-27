'use strict'

import test from 'ava'
import rotate from '../lib/rotate'

test('does not mutate the original object', t => {
  const obj = {
    outer: {
      inner: 5
    }
  }

  rotate(obj)

  t.deepEqual(obj, {
    outer: {
      inner: 5
    }
  })
})

test('swaps the inner and outer keys of an object', t => {
  const input = {
    outer1: {
      inner1: 5
    },
    outer2: {
      inner1: 7,
      inner2: 10
    },
    outer3: {
      inner1: 2
    }
  }
  const expected = {
    inner1: {
      outer1: 5,
      outer2: 7,
      outer3: 2
    },
    inner2: {
      outer2: 10
    }
  }

  t.deepEqual(rotate(input), expected)
})

test('creates an inner key ("inner" by default) if no key exists', t => {
  const input = {
    outerNoInner: 5,
    outer1: {
      inner1: 4
    }
  }
  const expected = {
    inner: {
      outerNoInner: 5
    },
    inner1: {
      outer1: 4
    }
  }

  t.deepEqual(rotate(input), expected)
})

test('works with function values', t => {
  const fn = () => 5
  const input = {
    outerNoInner: 5,
    outerFn: fn,
    outer1: {
      inner1: 4,
      inner2: 2
    }
  }
  const expected = {
    dummy: {
      outerNoInner: 5,
      outerFn: fn
    },
    inner1: {
      outer1: 4
    },
    inner2: {
      outer1: 2
    }
  }

  t.deepEqual(rotate(input, 'dummy'), expected)
})
