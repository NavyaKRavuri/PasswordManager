const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  name: { type: String },
  secrets: { 
      username : {type: String},
      password : {type: String},
  },
});

module.exports = mongoose.model("Account", accountSchema);
