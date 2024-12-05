"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserVote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserVote.init(
    {
      UserId: DataTypes.INTEGER,
      ProductId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "UserVote",
    }
  );
  return UserVote;
};
