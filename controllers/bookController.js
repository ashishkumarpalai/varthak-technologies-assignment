const { bookModel } = require("../models/bookModel");

async function createBook(req, res) {
  try {
    const userID = req.body.userID;
    const role = req.body.userRole;

    if (role.includes("creator")) {
      const newBook = new bookModel({
        title: req.body.title,
        createdBy: userID,
      });

      await newBook.save();

      res.status(201).json({ message: "Book created successfully" });
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
}

async function viewBooks(req, res) {
  try {
    const userID = req.body.userID;
    const role = req.body.userRole;
    const isOld = req.query.old === "1";
    const isNew = req.query.new === "1";

    if (isOld) {
      // Show books created 10 minutes ago and more
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const oldBooks = await bookModel.find({ createdAt: { $lte: tenMinutesAgo } });
      res.json(oldBooks);
    } else if (isNew) {
      // Show books created less than 10 minutes ago
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const newBooks = await bookModel.find({ createdAt: { $gt: tenMinutesAgo } });
      res.json(newBooks);
    } else {
      // Show books based on user roles
      if (role.includes("view_all")) {
        const allBooks = await bookModel.find();
        res.json(allBooks);
      } else if (role.includes("viewer")) {
        const userBooks = await bookModel.find({ createdBy: userID });
        res.json(userBooks);
      } else {
        res.sendStatus(403);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
}

module.exports = { createBook, viewBooks };
