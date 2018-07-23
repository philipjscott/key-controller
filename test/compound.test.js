/* global describe, it, KeyboardEvent */

'use strict'

import { decorate, desensitize } from '../lib/compound'
import { expect } from 'chai'

describe('Compound library handles compound keys', () => {
  describe('decorate decorates KeyboardEvent.key', () => {
    it('prepends peripheral active keys, in alphabetical order', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'A',
        ctrlKey: true,
        altKey: true,
        metaKey: true
      })

      expect(decorate(event)).to.equal('alt+ctrl+meta+A')
    })

    it('does not account for the shift key', () => {
      const event = new KeyboardEvent('keydown', {
        key: '+',
        ctrlKey: true,
        altKey: true,
        shiftKey: true
      })

      expect(decorate(event)).to.equal('alt+ctrl++')
    })
  })

  describe('desensitize normalizes case and ordering of compound keys', () => {
    it('normalizes case, calling toLowerCase()', () => {
      expect(desensitize('ALT+CTRL+p')).to.equal('alt+ctrl+p')
      expect(desensitize('Ctrl+Meta+ArrowLeft')).to.equal('ctrl+meta+ArrowLeft')
    })

    it('ensures the peripheral keys are in alphabetical order', () => {
      expect(desensitize('ctrl+meta+alt+p')).to.equal('alt+ctrl+meta+p')
      expect(desensitize('meta+ctrl+2')).to.equal('ctrl+meta+2')
    })

    it('does not modify primitive keys', () => {
      expect(desensitize('A')).to.equal('A')
      expect(desensitize('Space')).to.equal('Space')
      expect(desensitize('ArrowLeft')).to.equal('ArrowLeft')
      expect(desensitize('+')).to.equal('+')
    })

    it('normalizes both case and ordering simultaneously', () => {
      expect(desensitize('cTRl+META+alt+p')).to.equal('alt+ctrl+meta+p')
      expect(desensitize('ctrl+aLT+Space')).to.equal('alt+ctrl+Space')
      expect(desensitize('meta+Ctrl+2')).to.equal('ctrl+meta+2')
    })
  })
})
