const Money = require('./money');

class Portfolio {
    constructor() {
        this.moneys = [];
    }

    add(...moneys){
        this.moneys.push(...moneys);
    }

    evaluate(currency) {
        let failures = [];
        let total = this.moneys.reduce((sum, money) => {
            let convertedAmount = this.convert(money, currency);
            if (convertedAmount === undefined) {
                failures.push(money.currency + "->" + currency);
                return sum;
            }
            return sum + convertedAmount;
        }, 0);
        if (failures.length > 0) {
            throw new Error(`Missing exchange rate(s):[${failures.join(",")}]`);
        }
        return new Money(total, currency);
    }

    convert(money, currency) {
        let exchangeRates = new Map();
        exchangeRates.set("EUR->USD", 1.2);
        exchangeRates.set("USD->KRW", 1100);

        if (money.currency === currency) {
            return money.amount;
        }

        let key = money.currency + "->" + currency;
        let rate = exchangeRates.get(key);
        if (rate === undefined) {
            return undefined;
        }
        return money.amount * rate;
    }
}

module.exports = Portfolio;