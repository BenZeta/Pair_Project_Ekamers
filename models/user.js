"use strict";
const bcrypt = require("bcryptjs");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile);
      User.belongsToMany(models.Product, { through: "UserProducts" });
      User.belongsToMany(models.Product, { through: "UserVotes" });
      User.hasMany(models.Cart);
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      isVerified: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  User.beforeCreate((user) => {
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
  });

  // User.beforeBulkUpdate((user) => {
  //   try {
  //     const hash = bcrypt.hashSync(user.attributes.password, 10);
  //     user.attributes.password = hash;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  return User;
};
