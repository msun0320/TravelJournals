const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { journalSchema } = require("../schemas.js");
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

router.get("/new", (req, res) => {
  res.render("journals/new");
});

router.post(
  "/",
  validateJournal,
  catchAsync(async (req, res, next) => {
    // if (!req.body.journal) throw new ExpressError("Invalid journal data", 400);
    const journal = new Journal(req.body.journal);
    await journal.save();
    res.redirect(`/journals/${journal._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const journal = await Journal.findById(req.params.id).populate("comments");
    res.render("journals/show", { journal });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const journal = await Journal.findById(req.params.id);
    res.render("journals/edit", { journal });
  })
);

router.put(
  "/:id",
  validateJournal,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const journal = await Journal.findByIdAndUpdate(id, {
      ...req.body.journal,
    });
    res.redirect(`/journals/${journal._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Journal.findByIdAndDelete(id);
    res.redirect("/journals");
  })
);

module.exports = router;
