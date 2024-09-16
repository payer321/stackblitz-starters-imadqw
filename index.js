const express = require('express');
const cors = require('cors');

const app = express();
const port = 3010;
app.use(cors());

let taxRate = 5;
let discountPercentage = 10;
let loyalityRate = 2;

function calculate(newItemPrice, cartTotal) {
  let result = newItemPrice + cartTotal;
  return result;
}

app.get('/cart-total', (req, res) => {
  const newItemPrice = parseFloat(req.query.newItemPrice);
  const cartTotal = parseFloat(req.query.cartTotal);
  res.send(calculate(newItemPrice, cartTotal).toString());
});

function membership(cartTotal, isMember) {
  let result = cartTotal - (cartTotal * discountPercentage) / 100;
  if (isMember) {
    return result;
  }
}

app.get('/membership-discount', (req, res) => {
  const cartTotal = parseFloat(req.query.cartTotal);
  const isMember = req.query.isMember === 'true';
  res.send(membership(cartTotal, isMember).toString());
});

function tax(cartTotal) {
  let result = (cartTotal * taxRate) / 100;

  return result;
}

app.get('/calculate-tax', (req, res) => {
  const cartTotal = parseFloat(req.query.cartTotal);
  res.send(tax(cartTotal).toString());
});

function shipping(distance, shippingMethod) {
  if (shippingMethod === 'express') {
    return distance / 100;
  }
  if (shippingMethod === 'standard') {
    return distance / 50;
  }
}

app.get('/estimate-delivery', (req, res) => {
  const distance = parseFloat(req.query.distance);
  const shippingMethod = req.query.shippingMethod;
  res.send(shipping(distance, shippingMethod).toString());
});

function shippingCost(distance, weight) {
  let cost = weight * distance * 0.1;

  return cost;
}

app.get('/shipping-cost', (req, res) => {
  const distance = parseFloat(req.query.distance);
  const weight = parseFloat(req.query.weight);
  res.send(shippingCost(distance, weight).toString());
});

function purchase(purchaseAmount) {
  let result = loyalityRate * purchaseAmount;

  return result;
}

app.get('/loyalty-points', (req, res) => {
  const purchaseAmount = parseFloat(req.query.purchaseAmount);

  res.send(purchase(purchaseAmount).toString());
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
