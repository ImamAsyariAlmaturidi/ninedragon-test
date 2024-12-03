"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Authors", [
      {
        name: "J.K. Rowling",
        email: "jk.rowling@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "George R.R. Martin",
        email: "george.martin@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "J.R.R. Tolkien",
        email: "jrr.tolkien@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Isaac Asimov",
        email: "isaac.asimov@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Agatha Christie",
        email: "agatha.christie@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Authors", null, {});
  },
};
