const express = require("express");
const Stripe = require("stripe");
// const { Order } = require("../models/Order");

require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_KEY);

const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      metadata: {
        userId: req.body.id,
      },
    });

    const line_items = {
      price_data: {
        currency: "inr",
        product_data: {
          name: req.body.name,
          description: req.body.desc,
          metadata: {
            id: req.body.id,
          },
        },
        unit_amount: req.body.price,
      },
      quantity: req.body.quantity,
    };
    console.log("Success");
    res.send({ statusCode: 200, message: "Payment Successful" });
  } catch (error) {
    res.send({ statusCode: 500, message: "Payment error" });
  }
});

module.exports = router;
