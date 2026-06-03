import React from "react";
import {
  Calendar,
  CreditCard,
  Users,
  Star,
  TrendingUp,
} from "lucide-react";

import "./AdminDashboardCards.css";

const AdminDashboardCards = () => {
  const stats = [
    {
      label: "Total Bookings",
      value: "48",
      growth: "+12% this month",
      icon: Calendar,
    },
    {
      label: "Revenue This Month",
      value: "₹8.4L",
      growth: "+8.3% vs last month",
      icon: CreditCard,
    },
    {
      label: "Active Clients",
      value: "214",
      growth: "+5 new this week",
      icon: Users,
    },
    {
      label: "Client Rating",
      value: "4.9",
      growth: "+0.1 this quarter",
      icon: Star,
    },
  ];

  return (
    <div className="adminDashboardCards-container">
      {stats.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className="adminDashboardCards-card"
          >
            <div className="adminDashboardCards-icon">
              <Icon size={22} />
            </div>

            <h2>{card.value}</h2>

            <p>{card.label}</p>

            <div className="adminDashboardCards-growth">
              <TrendingUp size={14} />
              {card.growth}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminDashboardCards;