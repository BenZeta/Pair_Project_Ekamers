"use strict";
const fs = require("fs").promises;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = JSON.parse(await fs.readFile("./data/profiles.json", "utf-8"));

    const profiles = data.map((profile) => {
      delete profile.id;
      profile.createdAt = profile.updatedAt = new Date();
      return profile;
    });

    await queryInterface.bulkInsert("Profiles", profiles);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Profiles", null);
  },
};
