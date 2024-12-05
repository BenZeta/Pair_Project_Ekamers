"use strict";
const fs = require("fs").promises;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(await fs.readFile("./data/categories.json", "utf-8"));

    const categories = data.map((category) => {
      delete category.id;
      category.createdAt = category.updatedAt = new Date();
      return category;
    });

    await queryInterface.bulkInsert("Categories", categories);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Categories", null);
  },
};
