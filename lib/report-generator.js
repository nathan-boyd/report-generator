'use strict';
var html = require("html");
var fs = require('fs');

(function () {

    function ReportGenerator(reportFileName, columnNames, next) {

        var self = this;

        self.report = '';

        next = (typeof next === 'function') ? next : function () {
        };

        if (!reportFileName) {
            return next(new Error('_reportFileName parameter null'));
        }

        if (!columnNames) {
            return next(new Error('columnNames parameter null'));
        }

        if (!Array.isArray(columnNames)) {
            return next(new Error('columnNames parameter is not an array'));
        }

        self._reportFileName = reportFileName;
        self._columnNames = columnNames;

        var block = '<HTML>' +
            '<BODY>' +
            '<Table id="reportTable" align="center" border=.5 cellpadding=3 cellspacing=.5>';

        self.report = self.report.concat(block);

        //todo write a proper header row
        self.writeRows(columnNames, next);
    }

    ReportGenerator.prototype.writeRows = function (rows, next) {

        var self = this;

        next = (typeof next === 'function') ? next : function () {
        };

        if (!rows) {
            return next(new Error('rows is null'));
        }

        if (!Array.isArray(rows)) {
            return next(new Error('rows parameter is not an array'));
        }

        var cells = '<TR>';
        rows.forEach(function (row) {

            if (typeof row === 'string' || row instanceof String) {
                cells = cells.concat('<TD><pre>' + row + '</pre></TD>');
            } else {
                row.forEach(function (cell) {

                    var backgroundColor = '#FFFFFF';
                    if (cell.color) {
                        backgroundColor = cell.color;
                    }

                    var content = cell;
                    if (cell.cellContent) {
                        content = cell.cellContent;
                    }

                    cells = cells.concat('<TD bgcolor="' + backgroundColor + '"><pre>' + content + '</pre></TD>');
                });
            }
            cells = cells.concat('</TR>');
        });

        self.report = self.report.concat(cells);
        next(null);
    };

    ReportGenerator.prototype.closeReport = function (next) {

        var self = this;

        var block = '</Table>' +
            '</BODY>' +
            '</HTML>';

        self.report = self.report.concat(block);

        // get string size in bytes
        var stringByteSize = Buffer.byteLength(self.report, 'utf8');

        // pretty if string is less than half a MB
        if (stringByteSize < 500000) {
            /* jshint camelcase:false */
            block = html.prettyPrint(self.report, {indent_size: 2});
        }

        try {
            fs.writeFile(self._reportFileName, block, next);
        }
        catch (ex) {
            return next(new Error(ex));
        }

    };

    module.exports = ReportGenerator;
}());
