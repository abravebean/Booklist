// Dependencies
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const methodOverride = require('method-override')
// import our book model to use
const Book = require('./models/book.js')
// Pulls environment vars into serv er js from .env
require('dotenv').config()
const PORT = process.env.PORT
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Database Connection Logs
const db = mongoose.connection
db.on("error", (err) => console.log(err.message))
db.on("connected", () => console.log("mongo connected"))
db.on("disconnected", () => console.log("mongo disconnected"))
//MIDDLEWARE
// Body Parser middleware - give us access to req.body
app.use(express.urlencoded({ extended: true }))
// captures (post) requests for put and delete and convertes them from a post
app.use(methodOverride("_method"))
// I N D U C E S - Index New Delete Update Create Edit Show
// INDEX
app.get("/books", (req, res) => {
  Book.find({}, (error, allBooks) => {
    res.render("index.ejs", { books: allBooks })
  })
})

// NEW
app.get("/books/new", (req, res) => {
  res.render("new.ejs")
})
// DELETE
app.delete("/books/:id", (req, res) => {
  Book.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect("/books")
  })
})

// Update
app.put("/books/:id", (req, res) => {
  if (req.body.completed === "on") {
    req.body.completed = true
  } else {
    req.body.completed = false
  }
  Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    },
    (error, updatedBook) => {
      res.redirect(`/books/${req.params.id}`)
    }
  )
})
// CREATE
app.post("/books", (req, res) => {
  if (req.body.completed === "on") {
    // if the "completed" checkbox is checked change it to true
    req.body.completed = true
  } else {
    // if the checkbox is not checked change it to false
    req.body.completed = false
  }
  Book.create(req.body, (error, createdBook) => {
    res.redirect("/books")
  })
})
// Edit
app.get("/books/:id/edit", (req, res) => {
  Book.findById(req.params.id, (error, foundBook) => {
    res.render("edit.ejs", {
      book: foundBook,
    })
  })
})

// SHOW
app.get("/books/:id", (req, res) => {
  Book.findById(req.params.id, (err, foundBook) => {
    res.render("show.ejs", { book: foundBook })
  })
})
// Routes / Controllers
// Seed
app.get("/books/seed", (req, res) => {
  Book.deleteMany({}, (error, allBooks) => {})
  Book.create(
    [
      {
        title: "Cracking the Coding Interview",
        author: "Gayle Laakmann McDowell",
      },
      {
        title: "HTML and CSS: Design and Build Websites",
        author: "Jon Duckett",
      },
      {
        title: "JavaScript and JQuery: Interactive Front-End Web Development ",
        author: "jon Duckett",
      },
      {
        title: "You Don't Know JS Yet",
        author: "Kyle Simpson",
      },
      {
        title:
          "Design Patterns: Elements of Reusable Object-Oriented Software ",
        author: "Erich Gamma",
      },
      {
        title: "Frontend Unicorn",
        author:
          "Michał Malewicz, Szymon Adamiak, Albert Pawłowski, and Albert Walicki",
      },
      {
        title: "Don't Make Me Think",
        author: "Steve Krug",
      },
    ],
    (error, data) => {
      res.redirect("/books")
    }
  )
})
// Listener
app.listen(PORT, ()=> console.log(`You are listening to the smoothe sounds of port ${PORT}...`))