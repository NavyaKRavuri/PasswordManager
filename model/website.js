const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const websiteSchema = new mongoose.Schema({
  url: { type: String, default: null },
  title: { type: String },
  accountIds : [{ type: Schema.Types.ObjectId, ref: 'Account' }]
});

module.exports = mongoose.model("Website", websiteSchema);