"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Book.belongsTo(models.Author, { foreignKey: "author_id" });
    }
  }
  Book.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Title sebuah buku tidak boleh kosong",
          },
          notNull: {
            msg: "Title sebuah buku tidak boleh kosong",
          },
        },
      },
      serial_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
          msg: "Serial number telah dipakai",
        },
        validate: {
          notEmpty: {
            msg: "Serial number sebuah buku tidak boleh kosong",
          },
          notNull: {
            msg: "Serial number sebuah buku tidak boleh kosong",
          },
        },
      },
      published_at: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Published At sebuah buku tidak boleh kosong",
          },
          notNull: {
            msg: "Published At sebuah buku tidak boleh kosong",
          },
        },
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Author ID sebuah buku tidak boleh kosong",
          },
          notNull: {
            msg: "Author ID sebuah buku tidak boleh kosong",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
