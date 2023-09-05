"use strict";

const Sequelize = require("sequelize");
const process = require("process");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

//db에 user을 생성
db.User = require("./User")(sequelize);
db.Chat = require("./Chat")(sequelize);
db.participant = require("./participant")(sequelize);
db.room = require("./room")(sequelize);
db.connectList = require("./connList")(sequelize);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
