const getRupiahFormat = require("../helpers/getRupiahFormat");
const { User, Product, UserProduct, Profile, UserVote } = require("../models");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

class AuthController {
  static async showLogin(req, res) {
    try {
      res.render("auth_page/login.ejs", { error: req.query.error });
    } catch (error) {
      res.send(error);
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        const error = "Invalid email/password";
        return res.redirect(`/login/?error=${error}`);
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        const error = "Invalid email/password";
        return res.redirect(`/login/?error=${error}`);
      }

      req.session.userId = user.id;
      req.session.role = user.role;
      req.session.email = email;

      res.redirect("/home");
    } catch (error) {
      res.send(error);
    }
  }

  static async showRegister(req, res) {
    try {
      const { error } = req.query;

      res.render("auth_page/register.ejs", { error });
    } catch (error) {
      res.send(error);
    }
  }

  static async register(req, res) {
    try {
      const { name, email, password, profileImg } = req.body;
      const newUser = await User.create({
        name,
        email,
        password,
        role: "Buyer",
      });

      await Profile.create({
        username: Profile.upperCaseFirstLetter(name),
        profileImg: profileImg ? profileImg : `https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400`,
        UserId: newUser.id,
      });

      res.redirect("/login");
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        const errors = error.errors.map((err) => {
          return err.message;
        });
        res.redirect(`/register?error=${errors}`);
      } else {
        res.send(error);
      }
    }
  }

  static async logout(req, res) {
    try {
      req.session.destroy();
      res.redirect("/login");
    } catch (error) {
      res.send(error);
    }
  }

  static async landingPage(req, res) {
    try {
      const products = await Product.findAll();
      res.render("landingPage.ejs", { products });
    } catch (error) {
      res.render(error);
    }
  }

  static async home(req, res) {
    try {
      const { role, userId } = req.session;
      let options = {};

      if (role === "Seller") {
        options.include = {
          model: User,
          required: true,
          through: {
            model: UserProduct,
            where: {
              UserId: userId,
            },
          },
        };
        options.order = [["stock", "DESC"]];
        if (req.query.search) {
          options.where = {
            name: {
              [Op.iLike]: `%${req.query.search}%`,
            },
          };
        }
      } else {
        options.include = {
          model: User,
          required: false,
          through: UserVote,
          where: {
            id: userId,
          },
        };
        options.order = [["stock", "DESC"]];
        if (req.query.search) {
          options.where = {
            name: {
              [Op.iLike]: `%${req.query.search}%`,
            },
          };
        }
      }
      const products = await Product.findAll(options);
      console.log(products);

      const profile = await Profile.findOne({
        where: {
          UserId: userId,
        },
      });

      const { errors, message } = req.query;

      res.render("home.ejs", { products, role, profile, errors, message });
    } catch (error) {
      res.send(error);
    }
  }

  static async profile(req, res) {
    try {
      let errors;
      if (req.query.error) {
        errors = req.query.error;
      }
      console.log(errors);

      const user = await User.findOne({
        where: {
          id: req.session.userId,
        },
        include: Profile,
      });

      res.render("auth_page/profile.ejs", { user, errors });
    } catch (error) {
      res.send(error);
    }
  }

  static async updateProfile(req, res) {
    try {
      const { username, email, password, profileImg } = req.body;
      req.session.email = email;

      await User.update(
        { email, password },
        {
          where: {
            id: req.session.userId,
          },
        }
      );

      await Profile.update(
        { username, profileImg },
        {
          where: {
            id: req.session.userId,
          },
        }
      );
      res.redirect("/home");
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        const errors = error.errors.map((err) => {
          return err.message;
        });
        res.redirect(`/profile?error=${errors}`);
      } else {
        res.send(error);
      }
    }
  }

  static async changeRole(req, res) {
    try {
      const { userId, role } = req.session;

      if (role === "Buyer") {
        await User.update({ role: "Seller" }, { where: { id: userId } });
        req.session.role = "Seller";
      } else {
        await User.update({ role: "Buyer" }, { where: { id: userId } });
        req.session.role = "Buyer";
      }

      res.redirect("/home");
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = AuthController;
