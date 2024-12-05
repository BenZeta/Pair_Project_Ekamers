"use strict";
const fs = require("fs").promises;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(await fs.readFile("./data/products.json", "utf-8"));

    const products = data.map((product) => {
      delete product.id;
      product.createdAt = product.updatedAt = new Date();
      return product;
    });

    await queryInterface.bulkInsert("Products", products);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null);
  },
};
