const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  status : {
    type : String,
    enum :['Active','Inactive'],
    default : 'Active'
  },
}, { timestamps : true } );

module.exports = mongoose.model('Category',categorySchema);
