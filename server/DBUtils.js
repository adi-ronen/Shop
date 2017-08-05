//this is only an example, handling everything is yours responsibilty !

//var Request = require('tedious').Request;
//var TYPES = require('tedious').TYPES;

//----------------------------------------------------------------------------------------------------------------------

exports.Select = function(connection, query, callback) {
    var req = new Request(query, function (err, rowCount) {
        if (err) {
            console.log(err);
      return;
        }
    });
    var ans = [];
    var properties = [];
    req.on('columnMetadata', function (columns) {
        columns.forEach(function (column) {
            if (column.colName != null)
                properties.push(column.colName);
        });
    });
    req.on('row', function (row) {
        var item = {};
        for (i=0; i<row.length; i++) {
            item[properties[i]] = row[i].value;
        }
        ans.push(item);
    });

    req.on('requestCompleted', function () {
        //don't forget handle your errors
        console.log('request Completed: '+ req.rowCount + ' row(s) returned');
        console.log(ans);
        callback(ans);
    });



    connection.execSql(req);

};