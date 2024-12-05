const { Product, Category, UserProduct } = require("../models");

class SellerController {
  static async showAddProduct(req, res) {
    try {
      let errors;
      if (req.query.error) {
        errors = req.query.error.split(",");
      }

      const categories = await Category.findAll();
      console.log(categories);

      res.render("sellers/addProduct.ejs", { categories, errors });
    } catch (error) {
      res.send(error);
    }
  }

  static async addProduct(req, res) {
    try {
      const { userId } = req.session;

      const { name, description, price, stock, CategoryId, productImg } = req.body;

      const newProduct = await Product.create({
        name,
        description,
        price,
        CategoryId,
        productImg,
        stock,
      });

      await UserProduct.create({
        UserId: userId,
        ProductId: newProduct.id,
      });

      res.redirect("/home");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => {
          return err.message;
        });
        res.redirect(`/seller/product/add?error=${errors}`);
      } else {
        res.send(error);
      }
    }
  }

  static async showEditProduct(req, res) {
    try {
      const { productId } = req.params;
      const { userId } = req.session;

      let errors;
      if (req.query.error) {
        errors = req.query.error.split(",");
      }
      const userProduct = await UserProduct.findOne({
        where: {
          UserId: userId,
          ProductId: productId,
        },
      });

      if (!userProduct) {
        return res.redirect(`/home?errors=Unauthorized access to edit product.`);
      }

      const product = await Product.findOne({
        where: {
          id: productId,
        },
      });
      const categories = await Category.findAll();

      res.render("sellers/editProduct.ejs", { product, categories, errors });
    } catch (error) {
      res.send(error);
    }
  }

  static async editProduct(req, res) {
    try {
      const { name, description, price, stock, CategoryId, productImg } = req.body;
      const { productId } = req.params;
      const { userId } = req.session;

      const findUserProduct = await UserProduct.findOne({
        where: {
          UserId: userId,
          ProductId: productId,
        },
      });

      if (!findUserProduct) {
        return res.redirect(`/home?errors=Unauthorized access to edit product.`);
      }

      await Product.update(
        {
          name,
          description,
          price,
          CategoryId,
          productImg,
          stock,
        },
        {
          where: {
            id: productId,
          },
        }
      );

      res.redirect("/home");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        const errors = error.errors.map((err) => {
          return err.message;
        });
        res.redirect(`/seller/product/${req.params.productId}/edit?error=${errors}`);
      } else {
        res.send(error);
      }
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { productId } = req.params;
      const { userId } = req.session;

      const findUserProduct = await UserProduct.findOne({
        where: {
          UserId: userId,
          ProductId: productId,
        },
      });

      if (!findUserProduct) {
        return res.redirect(`/home?errors=Unauthorized access to delete product.`);
      }

      await Product.destroy({
        where: {
          id: productId,
        },
      });

      res.redirect("/home");
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = SellerController;
