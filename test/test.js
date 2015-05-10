'use strict';

/*global describe, it, before, beforeEach, after*/
var fs = require('fs');
var cheerio = require('cheerio');
var assert = require('assert');
var chai = require('chai');
chai.expect();
chai.should();

var reportGenerator = require('../lib/report-generator');

describe('report generator', function () {

    var publicFunctionTestReportName = 'publicFunctionTest.html';
    var writeRowTestReportName = 'writeRowTestReport.html';

    describe('public functions', function () {

        after(function () {
            fs.unlinkSync(publicFunctionTestReportName);
            fs.unlinkSync(writeRowTestReportName);
        });

        describe('ReportGenerator', function () {

            it('calls back with no error when properly invoked', function (done) {
                new reportGenerator(publicFunctionTestReportName, ['foo'], function (err) {
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
                    new reportGenerator(publicFunctionTestReportName, null, function (err) {
                        assert(err !== null);
                        done();
                    });
                });

                it('calls back with error if columnNames is not an array', function (done) {
                    new reportGenerator(publicFunctionTestReportName, 'foo', function (err) {
                        assert(err !== null);
                        done();
                    });
                });
            });

            describe('has an optional callback', function () {

                it('should not throw when next is invalid', function (done) {
                    (function () {
                        new reportGenerator(publicFunctionTestReportName, ['foo'], '');
                        done();
                    }).should.not.throw(Error);
                });

                it('should treat next as optional', function (done) {
                    (function () {
                        new reportGenerator(publicFunctionTestReportName, ['foo']);
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

        describe('writeRows', function () {

            var generator;

            before(function () {
                generator = new reportGenerator(publicFunctionTestReportName, ['foo'], function (err) {
                    assert(err === null);
                });
            });

            describe('validates row parameter', function () {

                it('calls back with error if row is null', function (done) {
                    generator.writeRows(null, function (err) {
                        assert(err !== null);
                        done();
                    });
                });

                it('calls back with error if row is not an array', function (done) {
                    generator.writeRows('foo', function (err) {
                        assert(err !== null);
                        done();
                    });
                });
            });

            describe('has an optional callback', function () {

                it('should not throw when next is invalid', function (done) {
                    (function () {
                        generator.writeRows(['1'], {});
                        done();
                    }).should.not.throw(Error);
                });

                it('should treat next as optional', function (done) {
                    (function () {
                        generator.writeRows(['1']);
                        done();
                    }).should.not.throw(Error);
                });
            });

            describe('accepts an array of strings or objects', function () {

                it('accepts an array of arrays containting strings', function (done) {

                    var cells = [
                        "1"
                    ];

                    var row = [cells];

                    generator.writeRows(row, function (err) {
                        assert(err === null);
                        done();
                    });
                });

                it('accepts an array, containing an array of objects', function (done) {

                    var cells = [
                        {cellContent: '1', color: "red"},
                        {cellContent: '2', color: "red"}
                    ];

                    var row = [cells];

                    generator.writeRows(row, function (err) {
                        assert(err === null);
                        done();
                    });
                });

            });

            describe('adds rows to the report table', function () {

                var colCount = 5;
                var rowCount = 1000;

                before(function (done) {

                    this.timeout(20000);

                    // create headers for the table
                    var headers = [];
                    for (var colCounter = 0; colCounter < colCount; colCounter++) {
                        var content = "header " + colCounter;
                        headers.push({cellContent: content, color: "red"});
                    }

                    // create generator
                    var writeRowsGenerator;
                    writeRowsGenerator = new reportGenerator(writeRowTestReportName, [headers], function (err) {
                        assert(err === null);
                    });

                    // add rows to report
                    for (var rowCounter = 0; rowCounter < rowCount; rowCounter++) {

                        var row = [];

                        for (colCounter = 0; colCounter < colCount; colCounter++) {
                            var cellContent = "row " + rowCounter + " cell " + colCounter;
                            row.push({cellContent: cellContent});
                        }

                        writeRowsGenerator.writeRows([row]);
                    }

                    writeRowsGenerator.closeReport(done);
                });

                it('adds the correct number of rows', function (done) {

                    fs.readFile(writeRowTestReportName, 'utf8', function (err, data) {
                        if (err) {
                            return console.log(err);
                        }

                        var $ = cheerio.load(data);
                        var tableRows = $('table tr').length;

                        // todo update, right now the header is just another row
                        assert(tableRows - 1 === rowCount);
                        done();
                    });
                });
            });
        });

        describe('closeReport', function () {

            var generator;

            beforeEach(function () {
                generator = new reportGenerator(publicFunctionTestReportName, ['foo'], function (err) {
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

            describe('creates the report', function () {

                it('creates an html file', function () {
                    generator.closeReport();

                    fs.exists(publicFunctionTestReportName, function (exists) {
                        assert(exists === true);
                    });
                });
            });
        });
    });
});
