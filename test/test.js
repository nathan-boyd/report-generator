'use strict';

/*global describe, it, before*/

var assert = require('assert');
var chai = require('chai');
chai.expect();
chai.should();

var reportGenerator = require('../lib/report-generator');

describe('report generator', function () {

    var testReportName = 'testReport.html';

    describe('public functions', function () {

        describe('ReportGenerator', function () {

            it('calls back with no error when properly invoked', function (done) {
                new reportGenerator(testReportName, ['foo'], function (err) {
                    assert(err === null);
                    done();
                });
            });

            describe('validates reportFileName parameter', function () {

                it('calls back with error if reportFileName is null', function (done) {
                    new reportGenerator(null, ['foo'], function (err) {
                        assert(err !== null);
                        done();
                    });
                });

                it('calls back with error if reportFileName is invalid', function (done) {
                    new reportGenerator('', ['foo'], function (err) {
                        assert(err !== null);
                        done();
                    });
                });
            });

            describe('validates columnNames parameter', function () {

                it('calls back with error if columnNames is null', function (done) {
                    new reportGenerator(testReportName, null, function (err) {
                        assert(err !== null);
                        done();
                    });
                });

                it('calls back with error if columnNames is not an array', function (done) {
                    new reportGenerator(testReportName, 'foo', function (err) {
                        assert(err !== null);
                        done();
                    });
                });
            });

            describe('has an optional callback', function () {

                it('should not throw when next is invalid', function (done) {
                    (function () {
                        new reportGenerator(testReportName, ['foo'], '');
                        done();
                    }).should.not.throw(Error);
                });

                it('should treat next as optional', function (done) {
                    (function () {
                        new reportGenerator(testReportName, ['foo']);
                        done();
                    }).should.not.throw(Error);
                });
            });

            describe('when writing to the report file fails', function () {

                it('calls back with error ', function (done) {
                    var generator = new reportGenerator({}, ['foo']);
                    generator.closeReport(function (err) {
                        assert(err !== null);
                        done();
                    });
                });

            });
        });

        describe('writeRow', function () {

            var generator;

            before(function () {
                generator = new reportGenerator(testReportName, ['foo'], function (err) {
                    assert(err === null);
                });
            });

            describe('validates row parameter', function () {

                it('calls back with error if row is null', function (done) {
                    generator.writeRow(null, function (err) {
                        assert(err !== null);
                        done();
                    });
                });

                it('calls back with error if row is not an array', function (done) {
                    generator.writeRow('foo', function (err) {
                        assert(err !== null);
                        done();
                    });
                });
            });

            describe('writes multiple rows', function(){

                it('writes multiple rows', function(done){

                    generator.writeRow(['1'], function (err) {
                        assert(err === null);
                    });

                    generator.writeRow(['2'], function (err) {
                        assert(err === null);
                    });

                    generator.closeReport(done);

                });

            });

            describe('has an optional callback', function () {

                it('should not throw when next is invalid', function (done) {
                    (function () {
                        generator.writeRow(['1'], {});
                        done();
                    }).should.not.throw(Error);
                });

                it('should treat next as optional', function (done) {
                    (function () {
                        generator.writeRow(['1']);
                        done();
                    }).should.not.throw(Error);
                });
            });
        });

        describe('closeReport', function () {

            var generator;

            before(function () {
                generator = new reportGenerator(testReportName, ['foo'], function (err) {
                    assert(err === null);
                });
            });

            describe('validates parameters', function () {

                it('should treat next as optional', function (done) {
                    (function () {
                        generator.closeReport();
                        done();
                    }).should.not.throw(Error);
                });

                it('should not throw when next is invalid', function (done) {
                    (function () {
                        generator.closeReport('');
                        done();
                    }).should.not.throw(Error);
                });
            });

        });
    });
});
