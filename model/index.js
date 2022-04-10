const mongoose = require("mongoose");
const { Types } = require("mongoose");

const { Schema } = mongoose;

const comment = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Comment = mongoose.model("Comment", comment);

const book = new Schema({
  title: { type: String, required: true },
  comments: [{ type: Types.ObjectId, ref: "Comment" }],
});

const Book = mongoose.model("Book", book);

exports.Comment = Comment;
exports.Book = Book;
