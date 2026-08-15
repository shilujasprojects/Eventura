const express = require("express");
const router = express.Router();
const controllers = require("../controllers/packageContoller");

router.post("/create-package", controllers.createPackage);
router.get("/", controllers.getPackages);
router.get("/:id", controllers.getPackageById);
router.put("/edit-package/:id", controllers.updatePackage);
router.delete("/:id", controllers.deletePackage);

module.exports = router;