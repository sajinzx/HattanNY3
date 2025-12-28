
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
    ticketType: TicketType.STAG,
    quantity: 1,
    amountPaid: 0
  });

  const totalCost = TICKET_PRICES[formData.ticketType] * formData.quantity;
  const amountPending = totalCost - formData.amountPaid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    // Fallback for crypto.randomUUID() which requires secure context
    const id = typeof crypto.randomUUID === 'function' 
      ? crypto.randomUUID() 
      : `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newBooking: Booking = {
      id,
      ...formData,
      totalCost,
      amountPending,
      createdAt: Date.now()
    };
    onAdd(newBooking);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-fadeIn">
      <div className="bg-indigo-600 px-8 py-6 text-white">
        <h2 className="text-2xl font-bold">New Booking Entry</h2>
        <p className="text-indigo-100 mt-1">Fill in the attendee details below</p>
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
              placeholder="e.g. Rahul Sharma"
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
              placeholder="+91 00000 00000"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Ticket Type</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
              value={formData.ticketType}
              onChange={e => setFormData({ ...formData, ticketType: e.target.value as TicketType })}
            >
              {Object.values(TicketType).map(type => (
                <option key={type} value={type}>{type} (₹{TICKET_PRICES[type]})</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Amount Paid (₹)</label>
            <input
              type="number"
              min="0"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={formData.amountPaid}
              onChange={e => setFormData({ ...formData, amountPaid: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-wrap justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Booking Value</p>
            <p className="text-2xl font-black text-gray-900">₹{totalCost.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Balance Remaining</p>
            <p className={`text-2xl font-black ${amountPending > 0 ? 'text-red-600' : 'text-green-600'}`}>
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
            Discard
          </button>
          <button
            type="submit"
            className="flex-1 py-4 px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Confirm Booking
          </button>
        </div>
      </form>
    </div>
  );
};
