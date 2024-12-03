import { Sequelize } from "sequelize";
import Book from "./book";
import Author from "./author";

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "mysql",
  dialectModule: require("mysql2"),
});

const db = {
  sequelize,
  Sequelize,
  Book: Book(sequelize, Sequelize.DataTypes),
  Author: Author(sequelize, Sequelize.DataTypes),
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default db;
