
import React, { useState } from 'react';
import { TicketType, Booking } from '../types';
import { TICKET_PRICES } from '../constants';

interface BookingFormProps {
  onAdd: (booking: Booking) => void;
  onCancel: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    tickets: {
      [TicketType.STAG]: 0,
      [TicketType.COUPLE]: 0,
      [TicketType.ANGELS]: 0
    },
    amountPaid: 0
  });

  const totalCost = 
    (formData.tickets[TicketType.STAG] * TICKET_PRICES[TicketType.STAG]) +
    (formData.tickets[TicketType.COUPLE] * TICKET_PRICES[TicketType.COUPLE]) +
    (formData.tickets[TicketType.ANGELS] * TICKET_PRICES[TicketType.ANGELS]);

  const totalPax = 
    (formData.tickets[TicketType.STAG]) +
    (formData.tickets[TicketType.COUPLE] * 2) +
    (formData.tickets[TicketType.ANGELS] * 2);

  const amountPending = totalCost - formData.amountPaid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    if (totalCost === 0) {
      alert("Please select at least one ticket.");
      return;
    }

    const id = typeof crypto.randomUUID === 'function' 
      ? crypto.randomUUID() 
      : `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newBooking: Booking = {
      id,
      name: formData.name,
      phone: formData.phone,
      tickets: formData.tickets,
      totalPax,
      amountPaid: formData.amountPaid,
      totalCost,
      amountPending,
      createdAt: Date.now()
    };
    onAdd(newBooking);
  };

  const handleTicketChange = (type: TicketType, val: string) => {
    const num = parseInt(val) || 0;
    setFormData({
      ...formData,
      tickets: {
        ...formData.tickets,
        [type]: num
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-fadeIn">
      <div className="bg-indigo-600 px-8 py-6 text-white">
        <h2 className="text-2xl font-bold">New Booking Entry</h2>
        <p className="text-indigo-100 mt-1">Single or Group Booking</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              required
              autoFocus
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Guest Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
            <input
              type="tel"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="Contact No"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(TicketType).map(type => (
            <div key={type} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{type}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.tickets[type]}
                  onChange={e => handleTicketChange(type, e.target.value)}
                />
                <span className="text-xs text-gray-400 whitespace-nowrap">₹{TICKET_PRICES[type]}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Amount Advance / Paid (₹)</label>
          <input
            type="number"
            min="0"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            value={formData.amountPaid}
            onChange={e => setFormData({ ...formData, amountPaid: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Pax</p>
              <p className="text-xl font-black text-indigo-600">{totalPax} Guests</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider text-right">Total Value</p>
              <p className="text-xl font-black text-gray-900 text-right">₹{totalCost.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
            <p className="text-sm font-bold text-gray-700 uppercase">Balance Pending</p>
            <p className={`text-xl font-black ${amountPending > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₹{amountPending.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 px-6 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-4 px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Save Booking
          </button>
        </div>
      </form>
    </div>
  );
};
