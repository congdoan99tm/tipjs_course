'use strict';

const mongoose = require('mongoose');
const connectString = 'mongodb://redis://redis::27017/shopDEV';

mongoose
  .connect(connectString)
  .then((_) => console.log(`Connected Mongoose Success`))
  .catch((err) => console.log(`Error connect Mongoose: ${err}`));

// Dev
if (1 === 1) {
  mongoose.set('debug', true);
  mongoose.set('debug', { color: true });
}

module.exports = mongoose;
