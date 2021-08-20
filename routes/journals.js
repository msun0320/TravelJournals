const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { journalSchema } = require("../schemas.js");
const { isLoggedIn } = require("../middleware");

const ExpressError = require("../utils/ExpressError");
const Journal = require("../models/journal");

const validateJournal = (req, res, next) => {
  const { error } = journalSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const journals = await Journal.find({});
    res.render("journals/index", { journals });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("journals/new");
});

router.post(
  "/",
  isLoggedIn,
  validateJournal,
  catchAsync(async (req, res, next) => {
    const journal = new Journal(req.body.journal);
    journal.author = req.user._id;
    await journal.save();
    req.flash("success", "Successfully added a new journal");
    res.redirect(`/journals/${journal._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const journal = await await Journal.findById(req.params.id)
      .populate("comments")
      .populate("author");
    if (!journal) {
      req.flash("error", "Cannot find that journal");
      return res.redirect("/journals");
    }
    res.render("journals/show", { journal });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const journal = await Journal.findById(req.params.id);
    if (!journal) {
      req.flash("error", "Cannot find that journal");
      return res.redirect("/journals");
    }
    res.render("journals/edit", { journal });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateJournal,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const journal = await Journal.findByIdAndUpdate(id, {
      ...req.body.journal,
    });
    req.flash("success", "Successfully updated journal");
    res.redirect(`/journals/${journal._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Journal.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted journal");
    res.redirect("/journals");
  })
);

module.exports = router;
