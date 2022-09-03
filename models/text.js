const mongoose = require("mongoose");
const schema = mongoose.Schema;

const textSchema = new schema({
  location: {
    page: {
      type: String,
      required: true
    },
    section: {
      type: String,
      required: true
    }
  },
  type: {
    name: {
      type: String,
      required: true
    }, 
    options: {
      type: String, 
      required: false
    }
  },
  order: {
    type: Number,
    required: false
  },
  content: {
    type: String, 
    required: true
  }
})


module.exports = mongoose.model("Text", textSchema);