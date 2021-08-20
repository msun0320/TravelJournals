const Journal = require("../models/journal");
const Comment = require("../models/comment");

module.exports.createComment = async (req, res) => {
  const journal = await Journal.findById(req.params.id);
  const comment = new Comment(req.body.comment);
  comment.author = req.user._id;
  journal.comments.push(comment);
  await comment.save();
  await journal.save();
  req.flash("success", "Created new comment");
  res.redirect(`/journals/${journal._id}`);
};

module.exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  await Journal.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  req.flash("success", "Successfully deleted comment");
  res.redirect(`/journals/${id}`);
};
