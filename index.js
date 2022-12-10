require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const { mapItems } = require("./middleware");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/create-checkout-session", mapItems, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: req.line_items,
      success_url: `${process.env.SERVER_URL}/success.html`,
      cancel_url: `${process.env.SERVER_URL}/cancel.html`,
    });
    res.status(200).json({ url: session.url });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.SERVER_PORT, () =>
  console.log(`listening on PORT ${process.env.SERVER_PORT}`)
);
