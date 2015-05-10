'use strict';

/*global describe, after, afterEach, before*/

var chai = require('chai');
chai.expect();
chai.should();

var wd = require('wd');
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chaiAsPromised.transferPromiseness = wd.transferPromiseness;

if (!process.env.SAUCE_USERNAME) {
    throw new Error("Missing sauce user name");
}

if (!process.env.SAUCE_ACCESS_KEY) {
    throw new Error("Missing sauce access key");
}

if (!process.env.DESIRED){
    throw new Error("Missing desired env var");
}

var desired = JSON.parse(process.env.DESIRED);

wd.configureHttp({
    timeout: 60000,
    retryDelay: 15000,
    retries: 5
});

describe('browser test ' + desired.browserName, function () {

    var browser;
    var allPassed = true;

    before(function (done) {
        var username = process.env.SAUCE_USERNAME;
        var accessKey = process.env.SAUCE_ACCESS_KEY;
        browser = wd.promiseChainRemote("ondemand.saucelabs.com", 80, username, accessKey);

        if (process.env.VERBOSE) {
            browser.on('status', function (info) {
                console.log(info.cyan);
            });

            browser.on('command', function (meth, path, data) {
                console.log(' > ' + meth.yellow, path.grey, data || '');
            });
        }
        browser
            .init(desired)
            .nodeify(done);
    });

    afterEach(function (done) {
        allPassed = allPassed && (this.currentTest.state === 'passed');
        done();
    });

    after(function (done) {
        browser
            .quit()
            .sauceJobStatus(allPassed)
            .nodeify(done);
    });

    require('../test');
});
