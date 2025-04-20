import express from "express";
import Donation from "../models/Donation.js";
import Customer from "../models/Customer.js";
import SponsoredMeal from "../models/SponsoredMeal.js";

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    const totalOrders = await Donation.countDocuments();
    const revenueAgg = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const revenue = revenueAgg[0]?.total || 0;

    const sponsoredAgg = await SponsoredMeal.aggregate([
      { $group: { _id: null, total: { $sum: "$mealsCount" } } },
    ]);
    const sponsoredMeals = sponsoredAgg[0]?.total || 0;

    const activeCustomers = await Customer.countDocuments({ isActive: true });

    res.json({ totalOrders, revenue, sponsoredMeals, activeCustomers });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Server Error" });
  }
});
// POST: Create a new donation
router.post("/", async (req, res) => {
    try {
      const { customerId, amount, mealCount, donationDate, status } = req.body;
  
      const newDonation = new Donation({
        customerId,
        amount,
        mealCount,
        donationDate,
        status,
      });
  
      const savedDonation = await newDonation.save();
      res.status(201).json(savedDonation);
    } catch (err) {
      console.error("Error creating donation:", err);
      res.status(500).json({ error: "Failed to create donation" });
    }
  });
  
export default router;
