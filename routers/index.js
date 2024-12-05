const AuthController = require("../controllers/AuthController");
const loginAuth = require("../middleware/authorization");
const buyerRoute = require("./buyerRoute");
const sellerRoute = require("./sellerRoute");
const router = require("express").Router();

router.get("/register", AuthController.showRegister);
router.post("/register", AuthController.register);

router.get("/login", AuthController.showLogin);
router.post("/login", AuthController.login);

router.get("/", AuthController.landingPage);

router.use(loginAuth);

router.get("/home", AuthController.home);

router.get("/profile", AuthController.profile);

router.post("/profile", AuthController.updateProfile);

router.get("/logout", AuthController.logout);

router.get("/changerole", AuthController.changeRole);

router.use("/seller", sellerRoute);
router.use("/buyer", buyerRoute);

module.exports = router;
