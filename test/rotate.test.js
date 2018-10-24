/* global describe, it */

'use strict'

import rotate from '../lib/rotate'
import { expect } from 'chai'

describe('rotate.js swaps an object\'s inner and outer keys', () => {
  it('does not mutate the original object', () => {
    const obj = {
      outer: {
        inner: 5
      }
    }

    rotate(obj)

    expect(obj).to.deep.equal({
      outer: {
        inner: 5
      }
    })
  })

  it('swaps the inner and outer keys of an object', () => {
    const obj = {
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
    const rotatedObj = rotate(obj)

    expect(rotatedObj).to.deep.equal({
      inner1: {
        outer1: 5,
        outer2: 7,
        outer3: 2
      },
      inner2: {
        outer2: 10
      }
    })
  })

  it('creates an inner key if no key exists', () => {
    const obj = {
      outerNoInner: 5,
      outer1: {
        inner1: 4
      }
    }
    const rotatedObj = rotate(obj, 'dummy')

    expect(rotatedObj).to.deep.equal({
      dummy: {
        outerNoInner: 5
      },
      inner1: {
        outer1: 4
      }
    })
  })

  it('works with function values', () => {
    const fn = () => 5

    const obj = {
      outerNoInner: 5,
      outerFn: fn,
      outer1: {
        inner1: 4,
        inner2: 2
      }
    }
    const rotatedObj = rotate(obj, 'dummy')

    expect(rotatedObj).to.deep.equal({
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
    })
  })
})
