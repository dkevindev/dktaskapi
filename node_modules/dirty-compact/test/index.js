var should = require('chai').should();

var async = require('async');
var dirty = require('dirty');
var fs = require('fs');
var path = require('path');

var compact = require('../index.js').compact;

describe('compact', function () {
  it('should properly compact a database', function (cb) {
    var DATABASE = path.join(__dirname, 'test.db');
    var DATABASE_BACKUP = path.join(__dirname, 'test.db.bak');

    try {
      fs.unlinkSync(DATABASE);
      fs.unlinkSync(DATABASE_BACKUP);
    } catch (e) {
      // Pass
    }

    var db = dirty(DATABASE);

    db.on('load', function () {
      var i = 0;

      async.whilst(function () {
        return i < 100;
      }, function (cbWhilst) {
        db.set('key' + (i % 10), { test: 'value' }, cbWhilst);

        i++;
      }, function (err) {
        should.not.exist(err);

        compact(DATABASE, DATABASE_BACKUP, function (err) {
          var databaseFile = fs.statSync(DATABASE);
          var backupFile = fs.statSync(DATABASE_BACKUP);

          databaseFile.size.should.equal(380);
          backupFile.size.should.equal(3800);

          cb(err);
        });
      });
    });
  });
});
