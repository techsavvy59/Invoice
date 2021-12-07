const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customerModel");


router.post("/create", async (req, res) => {
  try {
    let { doc, name, direction, sellerId } = req.body;
    const existingUser = await Customer.findOne({ name: name });

    if (existingUser)
      return res
        .json({ msg: "An account with this name already exists.", status: 400 });

    const newCustomer = new Customer({
      name: name,
      doc: doc,
      direction: direction,
      sellerId: sellerId,
    });
    const savedCustomer = await newCustomer.save();
    res.json({status: 200});
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.get("/all/:id", async (req, res) => {

  let sellerId = req.params.id;
  const customers = await Customer.find({sellerId: sellerId});
  var customerMaps = [];

  await Promise.all(customers.map( async (customer, index) => {
    var customerMap = [];
    customerMap = {
      id: customer._id,
      name: customer.name,
      doc: customer.doc,
      sellerId: customer.sellerId,
      date: customer.createdAt,
    };
    customerMaps.push(customerMap);
  }));
  
  res.json(customerMaps);
});

router.get("/get/:id", async (req, res) => {

  let customerId = req.params.id;
  const customer = await Customer.find({_id: customerId});
  res.json(customer);
});

module.exports = router;