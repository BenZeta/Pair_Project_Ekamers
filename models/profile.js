"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User);
    }

    static upperCaseFirstLetter(username) {
      return username.charAt(0).toUpperCase() + username.slice(1);
    }
  }
  Profile.init(
    {
      username: DataTypes.STRING,
      profileImg: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Profile",
    }
  );
  return Profile;
};
