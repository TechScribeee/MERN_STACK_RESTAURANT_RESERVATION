import express from "express";
import Customer from "../models/Customer.js";

const router = express.Router();

// POST: Add a new customer
router.post("/", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const customer = new Customer({
      name,
      email,
      phone
    });

    const savedCustomer = await customer.save();
    res.status(201).json(savedCustomer);
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
