/**
 * -- COMMANDS --
 * RUN ALL TESTS: node node_modules/mocha/bin/mocha test
 * RUN WITH REPORTING: node node_modules/mocha/bin/mocha test --reporter node_modules/mochawesome/dist/mochawesome --reporter-options autoOpen=true
 */

var assert = require('assert'),
    test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
require('chromedriver');
// require('geckodriver');

test.describe('Kasutaja loomine ja kustutamine', function () {
    prepTest(this);

    test.it('Registreerimine', function () {
        createUser('test', 'test@test');
        driver.findElement(By.className('message')).getText().then(function (result) {
            assert.equal(result, 'Oled nüüd registreeritud!');
        });
    });

    test.it('Sisselogimine ja kasutaja kustutamine', function () {
        login('test@test');
        deleteUser();
        driver.findElement(By.className('message')).getText().then(function (result) {
            assert.equal(result, 'Kasutaja kustutatud!');
        });
    });
});

test.describe('Kahe kasutaja loomine, sõbraks lisamine, ürituse loomine ja nõustumine', function () {
    prepTest(this);

    test.it('Kasutaja test1 loomine', function () {
        createUser('test1', 'test1@test');
        driver.findElement(By.className('message')).getText().then(function (result) {
            assert.equal(result, 'Oled nüüd registreeritud!');
        });
    });

    test.it('Kasutaja test2 loomine', function () {
        createUser('test2', 'test2@test');
        driver.findElement(By.className('message')).getText().then(function (result) {
            assert.equal(result, 'Oled nüüd registreeritud!');
        });
    });

    test.it('Kasutaja test2 sõbraks lisamine', function () {
        login('test1@test');
        addFriend('Ees Pere');
        driver.findElement(By.className('message')).getText().then(function (result) {
            assert.equal(result, 'Sõbrakutse saadetud!');
        });
    });

    test.it('Kasutaja test1 sõbrakutse vastu võtmine', function () {
        login('test2@test');
        acceptFriend();
        driver.findElement(By.className('message')).getText().then(function (result) {
            assert.equal(result, 'Sõbrakutse vastu võetud!');
        });
    });

    test.it('Sündmuse loomine ja test1-e võlgnikuks lisamine', function () {
        login('test2@test');
        newEvent('Testsündmus', 'Lihtne testsündmus');
        addDebtor('test1', '10');
        driver.findElement(By.className('message')).getText().then(function (result) {
            assert.equal(result, 'Võlgnik lisatud!');
        });
    });

    test.it('Sündmusega nõustumine', function () {
        login('test1@test');
        acceptEvent();
        driver.findElement(By.className('message')).getText().then(function (result) {
            assert.equal(result, 'Makse kinnitatud!');
        });
    });

    test.it('Kasutaja test1 kustutamine', function () {
        login('test1@test');
        deleteUser();
        driver.findElement(By.className('message')).getText().then(function (result) {
            assert.equal(result, 'Kasutaja kustutatud!');
        });
    });

    test.it('Kasutaja test2 kustutamine', function () {
        login('test2@test');
        deleteUser();
        driver.findElement(By.className('message')).getText().then(function (result) {
            assert.equal(result, 'Kasutaja kustutatud!');
        });
    });
});


function prepTest(that) {
    that.timeout(50000);

    beforeEach(function () {
        driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
        // driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.firefox()).build();
    });

    afterEach(function () {
        driver.quit();
    });
}

function createUser(username, email) {
    driver.get("https://cryptic-anchorage-52730.herokuapp.com/");
    driver.findElement(By.xpath('//*[@id="signup"]')).click();

    driver.findElement(By.id('firstname')).sendKeys("Ees");
    driver.findElement(By.id('lastname')).sendKeys("Pere");
    driver.findElement(By.id('username')).sendKeys(username);
    driver.findElement(By.id('email')).sendKeys(email);
    driver.findElement(By.id('pass')).sendKeys("testpass");
    driver.findElement(By.id('repass')).sendKeys("testpass");
    driver.findElement(By.css('button')).click();
}

function login(email) {
    driver.get("https://cryptic-anchorage-52730.herokuapp.com/login");

    driver.findElement(By.id('email')).sendKeys(email);
    driver.findElement(By.id('pass')).sendKeys("testpass");
    driver.findElement(By.css('button')).click();
}

function deleteUser() {
    driver.get("https://cryptic-anchorage-52730.herokuapp.com/profiil");
    driver.wait(until.elementLocated(By.id('deleteAccount')), 5000);
    driver.findElement(By.id('deleteAccount')).click();
}

function addFriend(fullName) {
    driver.get("https://cryptic-anchorage-52730.herokuapp.com");
    driver.findElement(By.id('search')).sendKeys(fullName);
    driver.findElement(By.xpath('/html/body/nav/div/div/div[3]/form/button')).click();
    driver.findElement(By.xpath('/html/body/div/form/button')).click();
}

function acceptFriend() {
    driver.get("https://cryptic-anchorage-52730.herokuapp.com/profiil");
    driver.findElement(By.xpath('/html/body/div/div[1]/div/div[2]/form[1]/button')).click();
}

function newEvent(name, description) {
    driver.get("https://cryptic-anchorage-52730.herokuapp.com");
    driver.findElement(By.id('eventname')).sendKeys(name);
    driver.findElement(By.id('eventdesc')).sendKeys(description);
    driver.findElement(By.xpath('//*[@id="addEventForm"]/button')).click();
    driver.wait(until.alertIsPresent(), 5000);
    driver.switchTo().alert().accept();
}

function addDebtor(debtor, amount) {
    driver.get("https://cryptic-anchorage-52730.herokuapp.com");
    driver.findElement(By.id('debtor')).sendKeys(debtor);
    driver.findElement(By.id('amount')).sendKeys(amount);
    driver.findElement(By.xpath('/html/body/div/div[2]/div[2]/div/form/button')).click();
}

function acceptEvent() {
    driver.get("https://cryptic-anchorage-52730.herokuapp.com");
    console.log(driver.findElement(By.xpath('/html/body/div/div[2]/div[2]/div/p')).getText());
    driver.findElement(By.xpath('/html/body/div/div[2]/div[2]/div/form[1]/button')).click();
}
