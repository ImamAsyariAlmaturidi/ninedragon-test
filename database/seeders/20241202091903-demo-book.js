"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Books", [
      {
        title: "Harry Potter and the Sorcerer's Stone",
        serial_number: "HP001",
        published_at: new Date("1997-06-26"),
        author_id: 1, // Pastikan author_id sesuai dengan ID author di database
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "A Game of Thrones",
        serial_number: "AGOT001",
        published_at: new Date("1996-08-06"),
        author_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "The Hobbit",
        serial_number: "TH001",
        published_at: new Date("1937-09-21"),
        author_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Foundation",
        serial_number: "F001",
        published_at: new Date("1951-06-01"),
        author_id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Murder on the Orient Express",
        serial_number: "MOE001",
        published_at: new Date("1934-01-01"),
        author_id: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Harry Potter and the Chamber of Secrets",
        serial_number: "HP002",
        published_at: new Date("1998-07-02"),
        author_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "A Clash of Kings",
        serial_number: "ACOK001",
        published_at: new Date("1998-11-16"),
        author_id: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "The Two Towers",
        serial_number: "TTT001",
        published_at: new Date("1954-11-11"),
        author_id: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "I, Robot",
        serial_number: "IR001",
        published_at: new Date("1950-12-02"),
        author_id: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "And Then There Were None",
        serial_number: "ATTWN001",
        published_at: new Date("1939-11-06"),
        author_id: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Books", null, {});
  },
};
