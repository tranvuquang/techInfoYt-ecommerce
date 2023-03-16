"use strict";
require("dotenv").config();
import fs from "fs";
import path from "path";
import sql from "sequelize";

const Sequelize = sql as any;

const basename = path.basename(__filename);
const db: any = {};

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.NAME,
  process.env.PASSWORD,
  {
    host: "localhost",
    dialect: "postgres",
  }
);

fs.readdirSync(__dirname)
  .filter((file: any) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file: any) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
