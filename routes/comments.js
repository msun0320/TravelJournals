const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateComment } = require("../middleware");
const Journal = require("../models/journal");
const Comment = require("../models/comment");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

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
