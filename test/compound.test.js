'use strict'

/* global KeyboardEvent */

import test from 'ava'
import { decorate, desensitize } from '../lib/compound'

test('maps keyboard events to keyboard key strings', t => {
  const event = new KeyboardEvent('keydown', {
    key: 'A',
    ctrlKey: true,
    altKey: true,
    metaKey: true
  })

  t.is(decorate(event), 'alt+ctrl+meta+A')
})

test('ignores the shift key', t => {
  const event = new KeyboardEvent('keydown', {
    key: 'p',
    ctrlKey: true,
    altKey: true,
    shiftKey: true
  })

  t.is(decorate(event), 'alt+ctrl+p')
})

test('normalizes case', t => {
  t.is(desensitize('ALT+CTRL+p'), 'alt+ctrl+p')
  t.is(desensitize('Ctrl+Meta+ArrowLeft'), 'ctrl+meta+ArrowLeft')
})

test('ensures the peripheral keys are in alphabetical order', t => {
  t.is(desensitize('ctrl+meta+alt+p'), 'alt+ctrl+meta+p')
  t.is(desensitize('meta+ctrl+2'), 'ctrl+meta+2')
})

test('does not modify primitive keys', t => {
  t.is(desensitize('A'), 'A')
  t.is(desensitize('Space'), 'Space')
  t.is(desensitize('ArrowLeft'), 'ArrowLeft')
  t.is(desensitize('+'), '+')
})

test('decorate and desensitize work together', t => {
  const event = new KeyboardEvent('keydown', {
    key: '+',
    ctrlKey: true,
    altKey: true,
    shiftKey: true
  })

  t.is(desensitize(decorate(event)), 'alt+ctrl++')
})
