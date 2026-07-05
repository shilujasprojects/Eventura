const express = require("express");

const router = express.Router();

const upload = require("../middlewares/upload");

const {
  addService,
  getServices,
  getService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

router.post(
  "/",
  upload.fields([
    {
      name: "bannerImage",
      maxCount: 1,
    },
    {
      name: "galleryImages",
      maxCount: 10,
    },
  ]),
  addService,
);

router.get("/", getServices);

router.get("/:id", getService);

router.put(
  "/:id",
  upload.fields([
    {
      name: "bannerImage",
      maxCount: 1,
    },
    {
      name: "galleryImages",
      maxCount: 10,
    },
  ]),
  updateService,
);

router.delete("/:id", deleteService);

module.exports = router;
