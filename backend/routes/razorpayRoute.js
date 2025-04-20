import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

const razorpay = new Razorpay({
    key_id: "rzp_test_Lu86AAUTZRPeCb", // Replace with your test key
    key_secret: "emNGrDnBpxAt8cxuGhpgMMDT"
});

router.post("/", async (req, res) => {
    const { amount } = req.body;

    const options = {
        amount: amount * 100, // in paise
        currency: "INR",
        receipt: `receipt_order_${Math.random() * 1000}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        res.json({ success: true, order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Something went wrong" });
    }
});

export default router;
