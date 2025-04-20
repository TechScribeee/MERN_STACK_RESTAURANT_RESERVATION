import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  isActive: { type: Boolean, default: true }
});

const Customer = mongoose.model("Customer", customerSchema);

 export default Customer