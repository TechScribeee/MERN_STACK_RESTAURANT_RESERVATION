import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  amount: Number,
  donationId: { type: mongoose.Schema.Types.ObjectId, ref: "SponsoredMeal" },
  donationDate: { type: Date, default: Date.now },
  status: { type: String, default: "Pending" }
});

const Donation = mongoose.model("Donation", donationSchema);

export default Donation;
