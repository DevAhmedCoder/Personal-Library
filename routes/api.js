/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const Book = require("../model/index.js").Book;
const Comment = require("../model/index.js").Comment;
const { FormatBookRes } = require("../helpers/index.js");
module.exports = (app) => {
  app
    .route("/api/books")
    .post(async (req, res) => {
      const { title } = req.body;
      try {
        if (!title) return res.json("missing required field title");
        let book = await Book.create({ title });
        book = FormatBookRes(book);
        res.json(book);
      } catch (error) {
        res.json({ error });
      }
    })
    .get(async (req, res) => {
      try {
        let books = await Book.find().populate({
          path: "comments",
          select: "text-_id",
        });
        books = books.map((e) => FormatBookRes(e));
        res.json(books);
      } catch (error) {
        res.json({ error });
      }
    })
    .delete(async (req, res) => {
      try {
        await Book.deleteMany();
        await Comment.deleteMany();
        res.json("complete delete successful");
      } catch (err) {
        res.json({ error: error.message });
      }
    });

  app
    .route("/api/books/:id")
    .get(async (req, res) => {
      const _id = req.params.id;
      try {
        let book = await Book.findById(_id).populate({
          path: "comments",
          select: "text-_id",
        });
        if (!book) return res.json("no book exists");
        book = FormatBookRes(book);
        res.json(book);
      } catch (error) {
        res.json({ error });
      }
    })

    .post(async (req, res) => {
      const _id = req.params.id;
      const { comment } = req.body;
      try {
        if (!comment) return res.json("missing required field comment");
        let book = await Book.findById(_id);
        if (!book) return res.json("no book exists");
        const newComment = await Comment.create({ text: comment });
        book = await Book.findOneAndUpdate(
          { _id },
          { comments: [...book.comments, newComment._id] },
          {
            returnNewDocument: true,
            returnDocument: "after",
          }
        ).populate({
          path: "comments",
          select: "text-_id",
        });
        book = FormatBookRes(book);
        res.json(book);
      } catch (error) {
        res.json({ error });
      }
    })

    .delete(async (req, res) => {
      try {
        const book = await Book.findOneAndRemove({ _id: req.params.id });

        if (!book) return res.json("no book exists");
        const commentTest = await Comment.deleteMany({ _id: book.comments });

        res.json("delete successful");
      } catch (error) {
        res.json({ error });
      }
    });
};
