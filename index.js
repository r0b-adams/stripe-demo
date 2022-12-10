require("dotenv").config();
const express = require("express");
const path = require("path");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

const SUCCESS_URL = path.join(process.env.SERVER_URL, "/success.html");
const CANCEL_URL = path.join(process.env.SERVER_URL, "/cancel.html");

// Initialize the app and create a port
const app = express();
const PORT = process.env.PORT || 3002;

// Set up body parsing, static, and route middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const storeItems = new Map([
  [1, { price: 10000, name: "learn react today" }],
  [2, { price: 20000, name: "learn css today" }],
]);

const mapItems = (req, res, next) => {
  const items = req.body.items.map(item => {
    const storeItem = storeItems.get(item.id);
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: storeItem.name,
        },
        unit_amount: storeItem.price,
      },
      quantity: item.qty,
    };
  });
  req.line_items = items;
  next();
};

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

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
