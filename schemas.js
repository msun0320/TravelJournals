const BaseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.journalSchema = Joi.object({
  journal: Joi.object({
    title: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    date: Joi.date().required(),
    text: Joi.string().required().escapeHTML(),
    public: Joi.boolean(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
