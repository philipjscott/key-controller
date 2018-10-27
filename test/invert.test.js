'use strict'

import test from 'ava'
import invert from '../lib/invert'

test('does not mutate the original object', t => {
  const input = {
    'a': '1',
    'b': '2',
    'c': '3'
  }

  invert(input)

  t.deepEqual(input, {
    'a': '1',
    'b': '2',
    'c': '3'
  })
})

test('inverts an object that is a bijection', t => {
  const input = {
    'a': '1',
    'b': '2',
    'c': '3'
  }
  const expected = {
    '1': 'a',
    '2': 'b',
    '3': 'c'
  }

  t.deepEqual(invert(input), expected)
})

test('throws the duplicate value if the inputect is not a bijection', t => {
  const input = {
    'a': '1',
    'b': '3',
    'c': '3'
  }
  try {
    invert(input)

    t.fail()
  } catch (dup) {
    t.is(dup, '3')
  }
})

test('destructures array values into keys in inverted object', t => {
  const input = {
    'foo': ['bar', 'baz'],
    'a': '1',
    'b': '2'
  }
  const expected = {
    'bar': 'foo',
    'baz': 'foo',
    '1': 'a',
    '2': 'b'
  }

  t.deepEqual(invert(input), expected)
})

test('throws duplicate value when array values appear multiple times', t => {
  const input = {
    'foo': ['bar', 'baz'],
    'a': ['ayy', 'bar'],
    'b': '2'
  }
  try {
    t.log(JSON.stringify(invert(input)))

    t.fail()
  } catch (dup) {
    t.is(dup, 'bar')
  }
})
