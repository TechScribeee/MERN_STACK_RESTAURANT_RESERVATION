import Donation from "../models/Donation.js";
import Customer from "../models/Customer.js";
import SponsoredMeal from "../models/SponsoredMeal.js";

export const getDonationStats = async (req, res) => {
  try {
    const totalOrders = await Donation.countDocuments();
    const revenueData = await Donation.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const sponsoredMeals = await SponsoredMeal.aggregate([
      { $group: { _id: null, total: { $sum: "$mealsCount" } } }
    ]);
    const activeCustomers = await Customer.countDocuments({ isActive: true });

    res.json({
      totalOrders,
      revenue: revenueData[0]?.total || 0,
      sponsoredMeals: sponsoredMeals[0]?.total || 0,
      activeCustomers
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};