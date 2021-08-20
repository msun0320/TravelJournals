const express = require("express");
const router = express.Router();
const journals = require("../controllers/journals");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateJournal } = require("../middleware");

const ExpressError = require("../utils/ExpressError");
const Journal = require("../models/journal");
const { editJournalForm } = require("../controllers/journals");

router.get("/", catchAsync(journals.index));

router.get("/new", isLoggedIn, journals.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  validateJournal,
  catchAsync(journals.createJournal)
);

router.get("/:id", catchAsync(journals.showJournal));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(journals.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateJournal,
  catchAsync(journals.updateJournal)
);

router.delete("/:id", isLoggedIn, isAuthor, catchAsync(journals.deleteJournal));

module.exports = router;
