const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");


const {
  subscribe,
  getSubscribers,
  updateSubscriberStatus,
  deleteSubscriber,
} = require("../controllers/Newslettercontroller");

// TODO: import your existing admin auth middleware here, e.g.:
//   const { verifyAdmin } = require("../middlewares/authMiddleware");
// and add it as a second argument to each admin route below, the same way
// your other protected admin routes (dashboard/settings/etc.) already do it.
// I don't have authMiddleware.js in front of me, so I've left these three
// open rather than guess the export name — wire it in before shipping,
// since right now the subscriber list is NOT actually protected.

// Public — no auth
router.post("/subscribe", subscribe);

// Admin — protected
router.get("/", authMiddleware, getSubscribers);
router.patch("/:id/status", authMiddleware, updateSubscriberStatus);
router.delete("/:id", authMiddleware, deleteSubscriber);

module.exports = router;