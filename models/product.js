"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.Category);
      Product.belongsToMany(models.User, { through: "UserProducts" });
      Product.belongsToMany(models.User, { through: "UserVotes" });
      Product.hasMany(models.Cart);
    }

    // instance method
    getRupiahFormat(number) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(number);
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Product name can't be null.",
          },
          notEmpty: {
            msg: "Product name can't be empty.",
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Description can't be null.",
          },
          notEmpty: {
            msg: "Description can't be empty.",
          },
        },
      },
      price: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Price can't be null.",
          },
          notEmpty: {
            msg: "Price can't be empty.",
          },
          isInt: {
            msg: "Price needs to be a number.",
          },
          moreThanZero(val) {
            const intVal = parseInt(val, 10);
            if (isNaN(intVal) || intVal <= 0) {
              throw new Error("Price must be a valid number and above 0.");
            }
          },
        },
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Category can't be empty",
          },
          notEmpty: {
            msg: "Category can't be empty",
          },
        },
      },
      productImg: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Product image can't be null.",
          },
          notEmpty: {
            msg: "Product image can't be empty.",
          },
          isUrl: {
            msg: "Product image needs to be proper URL type.",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Stock can't be null.",
          },
          notEmpty: {
            msg: "Stock can't be empty.",
          },
          isInt: {
            msg: "Stock needs to be a number.",
          },
          moreThanZero(val) {
            const intVal = parseInt(val, 10);
            if (isNaN(intVal) || intVal <= 0) {
              throw new Error("Stock must be a valid number and above 0.");
            }
          },
        },
      },
      totalUpVote: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
