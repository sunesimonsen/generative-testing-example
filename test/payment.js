const { describe, it } = require('mocha')
const expect = require('unexpected').use(require('unexpected-check'))

const generators = require('chance-generators')
const seed = 42
const {
  integer,
  natural
} = generators(seed)

describe('handlePayment', () => {
  describe('version 1', () => {
    const handlePayment = (balance, payment) =>
          (!payment || balance - payment <= 0) ? balance : balance - payment

    it('zero payments does not change the balance', () => {
      expect((balance) => {
        expect(handlePayment(balance, 0), 'to equal', balance)
      }, 'to be valid for all', integer)
    })

    describe('with a balance of 100 and payments from 0 to 100', () => {
      it('deducts the balance', () => {
        expect((payment) => {
          expect(handlePayment(100, payment), 'to equal', 100 - payment)
        }, 'to be valid for all', natural({ max: 100 }))
      })
    })
  })

  describe('version 2', () => {
    const handlePayment = (balance, payment) =>
          (!payment || balance - payment < 0 // fix. only less than zero
          ) ? balance : balance - payment

    it('zero payments does not change the balance', () => {
      expect((balance) => {
        expect(handlePayment(balance, 0), 'to equal', balance)
      }, 'to be valid for all', integer)
    })

    describe('with a balance of 100 and payments from 0 to 100', () => {
      it('deducts the balance', () => {
        expect((payment) => {
          expect(handlePayment(100, payment), 'to equal', 100 - payment)
        }, 'to be valid for all', natural({ max: 100 }))
      })
    })

    it('handles negative balances in combination with negative payments', () => {
      expect((balance, payment) => {
        expect(handlePayment(balance, payment), 'to equal', balance - payment)
      }, 'to be valid for all', integer({ max: -1 }), integer({ max: -1 }))
    })
  })

  describe('version 3', () => {
    const handlePayment = (balance, payment) =>
          payment &&
          ((balance <= 0 && balance - payment > balance) ||
           balance - payment >= 0)
          ? balance - payment : balance

    it('zero payments does not change the balance', () => {
      expect((balance) => {
        expect(handlePayment(balance, 0), 'to equal', balance)
      }, 'to be valid for all', integer)
    })

    describe('with a balance of 100 and payments from 0 to 100', () => {
      it('deducts the balance', () => {
        expect((payment) => {
          expect(handlePayment(100, payment), 'to equal', 100 - payment)
        }, 'to be valid for all', natural({ max: 100 }))
      })
    })

    it('handles negative balances in combination with negative payments', () => {
      expect((balance, payment) => {
        expect(handlePayment(balance, payment), 'to equal', balance - payment)
      }, 'to be valid for all', integer({ max: -1 }), integer({ max: -1 }))
    })
  })
})
