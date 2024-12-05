const BuyerController = require("../controllers/BuyerController");
const router = require("express").Router();

router.get("/product/cart", BuyerController.showCart);

router.get("/product/cart/checkout", BuyerController.checkout);

router.get("/product/:productId/incrementQuantity", BuyerController.incrementQuantity);

router.get("/product/:productId/decrementQuantity", BuyerController.decrementQuantity);

router.get("/product/:productId/remove", BuyerController.deleteFromCart);

router.get("/product/:productId/cart", BuyerController.addToCart);

router.get("/product/:productId/like", BuyerController.likeProduct);

module.exports = router;
