const { Product, Cart, sequelize, UserVote } = require("../models");
const { Op } = require("sequelize");
const getRupiahFormat = require("../helpers/getRupiahFormat");
const { sendCheckoutEmail } = require("../helpers/nodemailer");
class BuyerController {
  static async showCart(req, res) {
    try {
      const carts = await Cart.findAll({
        include: {
          model: Product,
          attributes: ["id", "name", "price", "description", "stock"],
        },
        where: {
          stockProduct: {
            [Op.gt]: 0,
          },
        },
        order: [["createdAt", "DESC"]],
      });

      const { errors } = req.query;

      res.render("buyers/cart.ejs", { carts, getRupiahFormat, errors });
    } catch (error) {
      res.send(error);
    }
  }

  static async addToCart(req, res) {
    try {
      const { productId } = req.params;
      const { userId } = req.session;

      const findCart = await Cart.findOne({
        where: { ProductId: productId, UserId: userId },
        include: {
          model: Product,
          attributes: ["id", "name", "price", "description", "stock"],
        },
      });

      if (findCart) {
        await Cart.increment(
          { stockProduct: 1 },
          {
            where: { ProductId: productId, UserId: userId },
          }
        );
      } else {
        await Cart.create({
          UserId: userId,
          ProductId: productId,
          stockProduct: 1,
        });
      }

      res.redirect("/home");
    } catch (error) {
      res.send(error);
    }
  }

  static async deleteFromCart(req, res) {
    try {
      const { productId } = req.params;
      const { userId } = req.session;

      await Cart.destroy({
        where: {
          ProductId: productId,
          UserId: userId,
        },
      });

      res.redirect("/buyer/product/cart");
    } catch (error) {
      res.send(error);
    }
  }

  static async incrementQuantity(req, res) {
    try {
      const { productId } = req.params;
      const { userId } = req.session;

      await Cart.increment({ stockProduct: 1 }, { where: { ProductId: productId, UserId: userId } });

      res.redirect("/buyer/product/cart");
    } catch (error) {
      res.send(error);
    }
  }

  static async decrementQuantity(req, res) {
    try {
      const { productId } = req.params;
      const { userId } = req.session;

      await Cart.increment({ stockProduct: -1 }, { where: { ProductId: productId, UserId: userId } });
      res.redirect("/buyer/product/cart");
    } catch (error) {
      res.send(error);
    }
  }

  static async checkout(req, res) {
    try {
      const carts = await Cart.findAll({
        include: Product,
        where: {
          UserId: req.session.userId,
        },
      });

      if (carts.length === 0) {
        const errors = "You don't have any item(s) in your cart, Please add it first!";
        return res.redirect(`/buyer/product/cart?errors=${errors}`);
      }

      const insufficientStockItems = carts.filter((cartItem) => cartItem.Product.stock < cartItem.stockProduct);

      if (insufficientStockItems.length > 0) {
        const errors = `Insufficient stock for : ${insufficientStockItems.map((item) => item.Product.name).join(", ")}. Please adjust quantities.`;
        return res.redirect(`/buyer/product/cart?errors=${errors}`);
      }

      const orderId = carts.map((item) => item.id).join("-");
      console.log(req.session);

      const mappedData = {
        id: orderId,
        items: carts.map((item) => ({
          name: item.Product.name,
          quantity: item.stockProduct,
          price: parseInt(item.Product.price),
        })),
        totalPrice: carts.reduce((total, cart) => total + cart.Product.price * cart.stockProduct, 0),
      };

      await sequelize.transaction(async (t) => {
        for (const cartItem of carts) {
          const product = cartItem.Product;

          await product.decrement({ stock: cartItem.stockProduct }, { transaction: t });
        }

        await Cart.destroy({
          where: {
            UserId: req.session.userId,
          },
          transaction: t,
        });

        const recipientEmail = req.session.email;
        await sendCheckoutEmail(mappedData, recipientEmail);
      });

      res.redirect(`/home?message=Checkout successful! Happy shopping!`);
    } catch (error) {
      res.send(error);
    }
  }

  static async likeProduct(req, res) {
    try {
      const { productId } = req.params;
      const { userId } = req.session;

      const existingLike = await UserVote.findOne({
        where: {
          UserId: userId,
          ProductId: productId,
        },
      });

      if (existingLike) {
        await existingLike.destroy();

        await Product.decrement({ totalUpVote: 1 }, { where: { id: productId } });
      } else {
        await UserVote.create({
          UserId: userId,
          ProductId: productId,
        });

        await Product.increment({ totalUpVote: 1 }, { where: { id: productId } });
      }

      res.redirect("/home");
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = BuyerController;
