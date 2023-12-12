"use strict";

const mongoose = require("mongoose");
const {
  db: { host, name, port },
  app,
} = require("../configs/config.mongodb");
const connectString = `mongodb://${host}:${port}/${name}`;
const { countConnect } = require("../helpers/check.connect");

class Database {
  constructor() {
    this.connect();
  }
  // connect
  connect(type = "mongodb") {
    // Dev
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString, { maxPoolSize: 5 })
      .then((_) => {
        console.log(`Connected Mongoose Success:`, countConnect());
      })
      .catch((err) => console.log(`Error connect Mongoose: ${err}`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;

/* Dùng cách lv0 cũng tương tự, vì required trong nodejs
 sẽ cache và chỉ có 1 đối tượng mongo duy nhất được tạo.
 Nhưng tạo singleton như trên để tạo thói quen khi sử dụng
 java hay framework khác.
 */
