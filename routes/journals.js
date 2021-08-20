const express = require("express");
const router = express.Router();
const journals = require("../controllers/journals");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateJournal } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const Journal = require("../models/journal");

router
  .route("/")
  .get(catchAsync(journals.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateJournal,
    catchAsync(journals.createJournal)
  );

router.get("/new", isLoggedIn, journals.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(journals.showJournal))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateJournal,
    catchAsync(journals.updateJournal)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(journals.deleteJournal));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(journals.renderEditForm)
);

module.exports = router;
