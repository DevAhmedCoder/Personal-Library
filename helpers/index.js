const FormatBookRes = (book) => ({
  _id: book._id,
  title: book.title,
  commentcount: book.comments.length,
  comments: book.comments.map(({ text }) => text),
});
exports.FormatBookRes = FormatBookRes;
