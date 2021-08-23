const { journalSchema, commentSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Journal = require("./models/journal");
const Comment = require("./models/comment");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you must be signed in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.validateJournal = (req, res, next) => {
  const { error } = journalSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const journal = await Journal.findById(id);
  if (!journal.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/journals/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (!comment.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/journals/${id}`);
  }
  next();
};

module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isUser = (req, res, next) => {
  const { username } = req.params;
  if (req.user.username !== username) {
    req.flash("error", "You do not have permission to do that!!");
    return res.redirect("/journals");
  }
  next();
};

module.exports.hasPermissionToView = async (req, res, next) => {
  const { id } = req.params;
  const journal = await Journal.findById(id);
  if (!journal.public && !journal.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!!!");
    return res.redirect("/journals");
  }
  next();
};
