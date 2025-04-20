import express from "express";
import Donation from "../models/Donation.js";
import Customer from "../models/Customer.js";

const router = express.Router();

router.post('/', async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

  try {
    // Optionally, verify the payment signature here using Razorpay's API
    const isVerified = verifyRazorpaySignature(razorpayPaymentId, razorpayOrderId, razorpaySignature);

    if (!isVerified) {
      return res.status(400).json({ message: 'Payment signature mismatch' });
    }

    // Step 1: Find the corresponding donation record
    const donation = await Donation.findOne({ razorpayOrderId });

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Step 2: Update the donation status to "Completed"
    donation.status = 'Completed';
    //donation.razorpayPaymentId = razorpayPaymentId;
    //donation.razorpaySignature = razorpaySignature;

    await donation.save();

    // Step 3: Optionally, update the customer status or do any other post-payment tasks
    const customer = await Customer.findById(donation.customerId);
    if (customer) {
      // You can perform any action on the customer, such as sending a confirmation email.
    }

    // Respond with success
    res.json({ message: 'Payment successful, donation recorded.' });
  } catch (err) {
    console.error('Error handling payment success:', err);
    res.status(500).json({ message: 'Error processing payment success.' });
  }
});

// Helper function to verify the payment signature (you can use Razorpay's API for this)
function verifyRazorpaySignature(paymentId, orderId, signature) {
  const crypto = require('crypto');
  const key_secret = "emNGrDnBpxAt8cxuGhpgMMDT";
  
  const hmac = crypto.createHmac('sha256', key_secret);
  const generatedSignature = hmac.update(orderId + "|" + paymentId).digest('hex');

  return generatedSignature === signature;
}
export default router;
