## dirty-compact

Compact a [node-dirty](https://github.com/felixge/node-dirty) database.

### Example

```js
var compact = require('dirty-compact').compact;

compact('./database.db', './database.db.bak', function (err) {
  if (err) {
    throw err;
  }

  console.log('Success!');
});

```
