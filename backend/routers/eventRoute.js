const express = require("express");
const router = express.Router();
const controllers = require("../controllers/eventController");
const upload = require("../middlewares/upload");

const uploadFields = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "galleryImages", maxCount: 10 },
]);

router.post("/create-event", uploadFields, controllers.createEvent);
router.get("/", controllers.getEvents);
router.get("/:id", controllers.getEventById);
router.put("/edit-event/:id", uploadFields, controllers.updateEvent);
router.delete("/:id", controllers.deleteEvent);

module.exports = router;