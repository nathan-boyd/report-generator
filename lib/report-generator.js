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

        var headers = '';
        self._columnNames.forEach(function (columnName) {
            headers = headers.concat('<TD><pre>' + columnName + '</pre></TD>');
        });

        var block = '<HTML>' +
            '<BODY>' +
            '<Table align="center" border=.5 cellpadding=3 cellspacing=.5>' +
            '<TR align=center>' +
            headers +
            '</TR>';

        self.report = self.report.concat(block);
        next(null);
    }

    ReportGenerator.prototype.writeRow = function (rows, next) {

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
            cells = cells.concat('<TD><pre>' + row + '</pre></TD>');
        });
        cells = cells.concat('</TR>');

        self.report = self.report.concat(cells);
        next(null);
    };

    ReportGenerator.prototype.closeReport = function (next) {

        var self = this;

        var block = '</Table>' +
            '</BODY>' +
            '</HTML>';

        self.report = self.report.concat(block);
        /* jshint camelcase:false */
        var prettyHtml = html.prettyPrint(self.report, {indent_size: 2});

        try {
            fs.writeFile(self._reportFileName, prettyHtml, next);
        }
        catch (ex) {
            return next(new Error(ex));
        }

    };

    module.exports = ReportGenerator;
}());
