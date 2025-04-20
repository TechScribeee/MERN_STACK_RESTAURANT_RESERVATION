import mongoose from "mongoose";

const sponsoredMealSchema = new mongoose.Schema({
  donationId: { type: mongoose.Schema.Types.ObjectId, ref: "Donation" },
  mealsCount: Number
});

 const sponsoredMeal = mongoose.model("SponsoredMeal", sponsoredMealSchema);

 export default sponsoredMeal;
