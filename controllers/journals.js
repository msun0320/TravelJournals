const Journal = require("../models/journal");

module.exports.index = async (req, res) => {
  const journals = await Journal.find({});
  res.render("journals/index", { journals });
};

module.exports.renderNewForm = (req, res) => {
  res.render("journals/new");
};

module.exports.createJournal = async (req, res, next) => {
  const journal = new Journal(req.body.journal);
  journal.author = req.user._id;
  await journal.save();
  req.flash("success", "Successfully added a new journal");
  res.redirect(`/journals/${journal._id}`);
};

module.exports.showJournal = async (req, res) => {
  const journal = await await Journal.findById(req.params.id)
    .populate({
      path: "comments",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!journal) {
    req.flash("error", "Cannot find that journal");
    return res.redirect("/journals");
  }
  res.render("journals/show", { journal });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const journal = await Journal.findById(id);
  if (!journal) {
    req.flash("error", "Cannot find that journal");
    return res.redirect("/journals");
  }
  res.render("journals/edit", { journal });
};

module.exports.updateJournal = async (req, res) => {
  const { id } = req.params;
  const journal = await Journal.findByIdAndUpdate(id, {
    ...req.body.journal,
  });
  req.flash("success", "Successfully updated journal");
  res.redirect(`/journals/${journal._id}`);
};

module.exports.deleteJournal = async (req, res) => {
  const { id } = req.params;
  await Journal.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted journal");
  res.redirect("/journals");
};