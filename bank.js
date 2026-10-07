const Money = require("./money");

class Bank {
    constructor() {
        this.exchangeRates = new Map();
    }

    addExchangeRate(from, to, rate) {
        this.exchangeRates.set(`${from}->${to}`, rate);
    }

    convert(money, currency) {
        if (money.currency === currency) {
            return new Money(money.amount, currency);
        }

        let key = money.currency + "->" + currency;
        let rate = this.exchangeRates.get(key);
        if (rate === undefined) {
            throw new Error(key);
        }
        return new Money(money.amount * rate, currency);
    }
}

module.exports = Bank;