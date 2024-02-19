var async = require('async');
var copy = require('fs.extra').copy;
var dirty = require('dirty');
var fs = require('fs');
var _ = require('lodash');

exports.compact = function (database, backup, cb) {
  copy(database, backup, function (err) {
    if (err) {
      return cb(err);
    }

    var db = dirty(database);

    db.on('load', function () {
      var data = {};

      db.forEach(function (key, value) {
        data[key] = value;
      });

      db = null;

      fs.unlink(database, function (err) {
        if (err) {
          return cb(err);
        }

        db = dirty(database);

        db.on('load', function () {
          async.forEachSeries(_.keys(data), function (key, cbForEach) {
            db.set(key, data[key], cbForEach);
          }, function (err) {
            cb(err);
          });
        });
      });
    });
  });
};
