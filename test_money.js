const assert = require("assert");
const Money = require("./money");
const Portfolio = require("./protfolio");
const Bank = require('./bank');

class MoneyTest {
    constructor() {
        this.bank = new Bank();
        this.bank.addExchangeRate("EUR", "USD", 1.2);
        this.bank.addExchangeRate("USD", "KRW", 1100);
    }

    testMultiplication() {
        let tenEuro = new Money(10, "EUR");
        let twentyEuro = new Money(20, "EUR");
        assert.deepStrictEqual(tenEuro.times(2), twentyEuro);
    }

    testDivision() {
        let originalMoney = new Money(4002, "KRW");
        let expectedMoneyAfterDivision = new Money(1000.5, "KRW");
        assert.deepStrictEqual(originalMoney.divide(4), expectedMoneyAfterDivision);
    }

    testAddition() {
        let fiveDollars = new Money(5, "USD");
        let tenDollars = new Money(10, "USD");
        let fifteenDollars = new Money(15, "USD");
        let protfolio = new Portfolio();
        protfolio.add(fiveDollars, tenDollars);
        assert.deepStrictEqual(protfolio.evaluate(this.bank, "USD"), fifteenDollars);
    }

    testAdditionOfDollarsAndEuros() {
        let fiveDollars = new Money(5, "USD");
        let tenEuros = new Money(10, "EUR");
        let protfolio = new Portfolio();
        protfolio.add(fiveDollars, tenEuros);
        let expectedValue = new Money(17, "USD");
        assert.deepStrictEqual(protfolio.evaluate(this.bank, "USD"), expectedValue);
    }

    testAdditionOfDollarsAndWons() {
        let oneDollar = new Money(1, "USD");
        let elevenHundredWon = new Money(1100, "KRW");
        let protfolio = new Portfolio();
        protfolio.add(oneDollar, elevenHundredWon);
        let expectedValue = new Money(2200, "KRW");
        assert.deepStrictEqual(protfolio.evaluate(this.bank, "KRW"), expectedValue);
    }

    testAdditionWithMultipleMissingExchangeRates() {
        let oneDollar = new Money(1, "USD");
        let oneEuro = new Money(1, "EUR");
        let oneWon = new Money(1, "KRW");
        let protfolio = new Portfolio();
        protfolio.add(oneDollar, oneEuro, oneWon);
        let expectedError = new Error("Missing exchange rate(s):[USD->Kalganid,EUR->Kalganid,KRW->Kalganid]");
        assert.throws(() => protfolio.evaluate(this.bank, "Kalganid"), expectedError);
    }

    testConversion() {
        let tenEuros = new Money(10, "EUR");
        assert.deepStrictEqual(this.bank.convert(tenEuros, "USD"), new Money(12, "USD"));
    }

    testConversionWithMissingExchangeRate() {
        let tenEuros = new Money(10, "EUR");
        let expectedError = new Error("EUR->Kalganid");
        assert.throws(() => this.bank.convert(tenEuros, "Kalganid"), expectedError);
    }

    getAllTestMethods() {
        let moneyPrototype = MoneyTest.prototype;
        let allProperties = Object.getOwnPropertyNames(moneyPrototype);
        let testMethods = allProperties.filter(p => {
            return typeof moneyPrototype[p] === "function" && p.startsWith("test");
        });
        return testMethods;
    }

    runAllTests() {
        let testMethods = this.getAllTestMethods();
        testMethods.forEach(m => {
            console.log(`Running ${m}...`);
            let method = Reflect.get(this, m);
            try {
                Reflect.apply(method, this, []);
            } catch (e) {
                if (e instanceof assert.AssertionError) {
                    console.log(e);
                } else {
                    throw e;
                }
            }
        });
    }
}

new MoneyTest().runAllTests();