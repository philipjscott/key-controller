/* global describe, it */

'use strict'

import invert from '../lib/invert'
import { expect } from 'chai'

describe('invert.js inverts an object\'s keys and values', () => {
  it('does not mutate the original object', () => {
    const obj = {
      'a': '1',
      'b': '2',
      'c': '3'
    }

    invert(obj)

    expect(obj).to.deep.equal({
      'a': '1',
      'b': '2',
      'c': '3'
    })
  })

  it('inverts an object that is a bijection', () => {
    const obj = {
      'a': '1',
      'b': '2',
      'c': '3'
    }
    const inverse = invert(obj)

    for (const prop in obj) {
      expect(prop).to.equal(inverse[obj[prop]])
    }
  })

  it('throws the duplicate value if the object is not a bijection', () => {
    const obj = {
      'a': '1',
      'b': '3',
      'c': '3'
    }
    try {
      invert(obj)
    } catch (dup) {
      expect(dup).to.equal('3')
    }
  })

  it('destructures array values into keys in inverted object', () => {
    const obj = {
      'foo': ['bar', 'baz'],
      'a': '1',
      'b': '2'
    }
    const inverse = invert(obj)

    expect(inverse).to.deep.equal({
      'bar': 'foo',
      'baz': 'foo',
      '1': 'a',
      '2': 'b'
    })
  })

  it('throws duplicate object when array values appear multiple times', () => {
    const obj = {
      'foo': ['bar', 'baz'],
      'a': ['ayy', 'bar'],
      'b': '2'
    }
    try {
      invert(obj)
    } catch (dup) {
      expect(dup).to.equal('bar')
    }
  })
})
