const Controller = require("../controllers/AuthController");
const SellerController = require("../controllers/SellerController");
const router = require("express").Router();

router.get("/product/add", SellerController.showAddProduct);
router.post("/product/add", SellerController.addProduct);

router.get("/product/:productId/edit", SellerController.showEditProduct);
router.post("/product/:productId/edit", SellerController.editProduct);

router.get("/product/:productId/delete", SellerController.deleteProduct);

module.exports = router;
