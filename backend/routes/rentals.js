const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Transaction = require("mongoose-transactions");

const { Rental, validate } = require("../model/rental");
const { Movie } = require("../model/movie");
const { Customer } = require("../model/customer");

const transaction = new Transaction();

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { customerId, movieId } = req.body;

  const customer = await Customer.findById(customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    transaction.insert("rentals", rental);
    transaction.update(
      "movies",
      { _id: movie._id },
      { $inc: { numberInStock: -1 } }
    );

    res.send(rental);
  } catch (e) {
    res.status(500).send(`Something failed.${e}`);
  }
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental)
    return res.status(404).send("The rental with the given ID was not found.");

  res.send(rental);
});

module.exports = router;
