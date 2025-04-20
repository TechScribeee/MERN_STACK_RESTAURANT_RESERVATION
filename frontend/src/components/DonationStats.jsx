// DonationStats.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

import "./DonationDashboard.css"; // Same styling as your form if needed

const DonationStats = (refresh) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    revenue: 0,
    
    activeCustomers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/donations/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, [refresh]);

  return (
    <div className="donation-dashboard">
      <h2>Donation Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
        <div className="card">
          <h3>Revenue</h3>
          <p>₹{stats.revenue}</p>
        </div>
        <div className="card">
          <h3>Active Customers</h3>
          <p>{stats.activeCustomers}</p>
        </div>
      </div>
    </div>
  );
};

export default DonationStats;
