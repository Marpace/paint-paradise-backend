const mongoose = require("mongoose");
const schema = mongoose.Schema;

const imageSchema = new schema({
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
    name : {
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
  path: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model("Image", imageSchema);