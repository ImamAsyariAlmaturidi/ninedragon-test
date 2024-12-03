"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Author.hasMany(models.Book, { foreignKey: "author_id" });
    }
  }
  Author.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [3, 15],
          },
          notEmpty: {
            msg: "Author Name tidak boleh kosong",
          },
          notNull: {
            msg: "Author Name tidak boleh kosong",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Input harus berisi sebuah Email",
          },
          notNull: {
            msg: "Email tidak boleh kosong",
          },
          notEmpty: {
            msg: "Email tidak boleh kosong",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Author",
    }
  );
  return Author;
};
