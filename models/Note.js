const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    bookName: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    bookImage: {
      type: String, // store image URL or path
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
