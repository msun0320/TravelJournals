const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  validateComment,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware");
const Journal = require("../models/journal");
const Comment = require("../models/comment");
const comments = require("../controllers/comments");
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

router.post(
  "/",
  isLoggedIn,
  validateComment,
  catchAsync(comments.createComment)
);

router.delete(
  "/:commentId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(comments.deleteComment)
);

module.exports = router;
