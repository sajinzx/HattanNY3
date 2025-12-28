
import React from 'react';

interface StatsProps {
  totals: {
    paid: number;
    pending: number;
    total: number;
    count: number;
  };
  bookingCount: number;
}

export const Stats: React.FC<StatsProps> = ({ totals, bookingCount }) => {
  const cards = [
    {
      label: 'Total Collected',
      value: `₹${totals.paid.toLocaleString()}`,
      icon: 'fa-wallet',
      color: 'bg-green-100 text-green-700',
      description: 'Total amount paid by clients'
    },
    {
      label: 'Amount Pending',
      value: `₹${totals.pending.toLocaleString()}`,
      icon: 'fa-hand-holding-dollar',
      color: 'bg-red-100 text-red-700',
      description: 'Outstanding payments'
    },
    {
      label: 'Total Expected',
      value: `₹${totals.total.toLocaleString()}`,
      icon: 'fa-chart-line',
      color: 'bg-blue-100 text-blue-700',
      description: 'Gross ticket value'
    },
    {
      label: 'Attendees Booked',
      value: totals.count,
      icon: 'fa-users',
      color: 'bg-purple-100 text-purple-700',
      description: 'Total individual guests'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
              <i className={`fa-solid ${card.icon} text-lg`}></i>
            </div>
            <span className="text-xs font-semibold text-gray-400">LIVE</span>
          </div>
          <h4 className="text-gray-500 text-sm font-medium">{card.label}</h4>
          <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          <p className="text-xs text-gray-400 mt-2">{card.description}</p>
        </div>
      ))}
    </div>
  );
};
