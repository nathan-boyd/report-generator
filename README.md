# report-generator

[![Build Status](https://travis-ci.org/nathan-boyd/report-generator.svg?branch=master)](https://travis-ci.org/nathan-boyd/report-generator) [![Coverage Status](https://coveralls.io/repos/nathan-boyd/report-generator/badge.svg?branch=master)](https://coveralls.io/r/nathan-boyd/report-generator?branch=master) 

[![Sauce Test Status](https://saucelabs.com/browser-matrix/nathan-boyd.svg?auth=9459ca78bd664316a0cf84e43a98658a)](https://saucelabs.com/u/nathan-boyd)

report-generator encapsulates the task of creating simple html reports.

##quick example
```javascript

    var reportGenerator = require('report-generator');

    var generator new reportGenerator('report.html', ['col1', 'col2'], function (err) {
        assert(err === null);
    });

    // write a simple row
    generator.writeRow(['cell1', 'cell2'], function (err) {
        assert(err === null);
    });
    
    // write a row using a cell object, with color support
    var cells = [
        {cellContent: '1', color: "red"},
        {cellContent: '2', color: "red"}
    ];

    var row = [cells];

    generator.writeRows(row, function (err) {
        assert(err === null);
        done();
    });

    generator.closeReport(function(err){
        assert(err === null);
    });
    
```
