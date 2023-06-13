require("dotenv").config();
const express = require("express");
var cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");

const app = express();
app.use(cors());
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.json());

app.post("/checkout", async (req, res) => {
  const items = req.body.items;
  let lineItems = [];
  items.forEach((item) => {
    lineItems.push({ price: item.id, quantity: item.quantity });
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "https://ecommerce-fullstack.onrender.com/success.html",
    cancel_url: "https://ecommerce-fullstack.onrender.com/cancel.html",
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

app.listen(4000, () => console.log("Listening on port 4000!"));
