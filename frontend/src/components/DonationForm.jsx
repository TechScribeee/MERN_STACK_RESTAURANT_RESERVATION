import React, { useState } from "react";
import axios from "axios";

const DonationForm = () => {
  const [amount, setAmount] = useState("");

  const handleDonate = async () => {
    const amount = formData.amount;

    // 1. Create order from backend
    const res = await fetch("http://localhost:5000/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
    });

    const data = await res.json();
    if (!data.success) {
        alert("Failed to create order");
        return;
    }

    // 2. Open Razorpay checkout
    const options = {
        key: "rzp_test_Lu86AAUTZRPeCb", // Replace with your Razorpay test key
        amount: data.order.amount,
        currency: "INR",
        name: "Donation",
        description: "Test Transaction",
        order_id: data.order.id,
        handler: function (response) {
            alert("Payment successful!");
            console.log("Payment ID:", response.razorpay_payment_id);
        },
        prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
        },
        theme: {
            color: "#3399cc"
        }
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
};

  return (
    <div>
      <h2>Donate a Meal</h2>
      <form onSubmit={handleDonate}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount (INR)"
          required
        />
        <button type="submit">Donate Now</button>
      </form>
    </div>
  );
};

export default DonationForm;
