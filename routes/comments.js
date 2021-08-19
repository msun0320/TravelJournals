const express = require("express");
const router = express.Router({ mergeParams: true });
const Journal = require("../models/journal");
const Comment = require("../models/comment");
const { commentSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateComment,
  catchAsync(async (req, res) => {
    const journal = await Journal.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    journal.comments.push(comment);
    await comment.save();
    await journal.save();
    req.flash("success", "Created new comment");
    res.redirect(`/journals/${journal._id}`);
  })
);

router.delete(
  "/:commentId",
  catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Journal.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash("success", "Successfully deleted comment");
    res.redirect(`/journals/${id}`);
  })
);

module.exports = router;
