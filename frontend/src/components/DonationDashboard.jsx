import React, { useState } from "react";
import axios from "axios";
import DonationStats from "./DonationStats";
import "./DonationDashboard.css"; // Optional: use your custom styles

const DonationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    amount: "",
    donationDate: "",
    status: "Pending"
  });

  const [message, setMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRazorpayPayment = async (amount) => {
    try {
      // Step 1: Create an order on the backend
      const orderRes = await axios.post("http://localhost:8080/api/razorpay", {
        amount: amount * 100, // Convert to paise (Razorpay uses paise)
      });

      const { orderId, currency } = orderRes.data;

      // Step 2: Initiate Razorpay payment
      const options = {
        key: "rzp_test_Lu86AAUTZRPeCb", // Razorpay Key from .env
        amount: amount * 100, // Amount in paise
        currency: currency,
        order_id: orderId,
        name: formData.name,
        description: "Donation Payment",
        image: "https://example.com/your-logo.png", // Optional: logo image
        handler: async function (response) {
          // Step 3: Handle payment success
          const paymentDetails = {
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          // Send payment details to the backend
          await axios.post("http://localhost:8080/api/payment-success", paymentDetails);

          // Step 4: Create customer and donation records after payment success
          const customerRes = await axios.post("http://localhost:8080/api/customers", {
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          });

          const customerId = customerRes.data._id;

          // Step 5: Create donation record in the database
          await axios.post("http://localhost:8080/api/donations", {
            customerId,
            amount: parseFloat(formData.amount),
            donationDate: formData.donationDate,
            status: "Completed"
          });

          // ✅ Update dashboard
          setMessage("Donation successful!");
          setFormData({
            name: "",
            email: "",
            phone: "",
            amount: "",
            donationDate: "",
            status: "Pending"
          });

          setRefreshTrigger((prev) => prev + 1); // 🚀 Trigger stats update
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#F37254",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open(); // Open Razorpay checkout
    } catch (err) {
      console.error("Razorpay payment error:", err);
      setMessage("Error initiating payment.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Step 1: Check if the form is filled correctly and initiate Razorpay payment
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setMessage("Please enter a valid donation amount.");
      return;
    }

    try {
      // Trigger Razorpay payment
      await handleRazorpayPayment(parseFloat(formData.amount));
    } catch (err) {
      console.error("Payment error:", err);
      setMessage("Error initiating donation process.");
    }
  };

  return (
    <div className="donation-form">
      <h2>Make a Donation</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Customer Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Donation Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="donationDate"
          value={formData.donationDate}
          onChange={handleChange}
          required
        />
        <button type="submit">Donate</button>
      </form>

      {message && <p className="message">{message}</p>}

      {/* Donation stats section */}
      <DonationStats refresh={refreshTrigger} />
    </div>
  );
};

export default DonationForm;