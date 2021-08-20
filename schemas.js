const Joi = require("joi");

module.exports.journalSchema = Joi.object({
  journal: Joi.object({
    title: Joi.string().required(),
    // image: Joi.string().required(),
    location: Joi.string().required(),
    date: Joi.date().required(),
    text: Joi.string().required(),
    public: Joi.boolean(),
  }).required(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    body: Joi.string().required(),
  }).required(),
});
