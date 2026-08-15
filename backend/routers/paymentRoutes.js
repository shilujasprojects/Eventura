const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // path to your existing file

const controllers = require("../controllers/paymentController");

router.post("/submit", upload.single("receipt"), controllers.submitPayment);
router.get("/", controllers.getAllTransactions);
router.patch("/:id/verify", controllers.verifyTransaction);
router.patch("/:id/reject", controllers.rejectTransaction);
router.patch("/:id/refund", controllers.refundTransaction);
router.get("/client/:clientId", controllers.getClientTransactions);

module.exports = router;