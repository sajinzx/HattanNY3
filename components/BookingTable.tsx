
import React, { useState } from 'react';
import { Booking, TicketType } from '../types';

interface BookingTableProps {
  bookings: Booking[];
  onDelete: (id: string) => void;
  onClearAll?: () => void;
}

export const BookingTable: React.FC<BookingTableProps> = ({ bookings, onDelete, onClearAll }) => {
  const [search, setSearch] = useState('');

  const filtered = bookings.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.phone.includes(search)
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
      <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Booking Database</h2>
          {bookings.length > 0 && onClearAll && (
            <button 
              onClick={onClearAll}
              className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider"
            >
              Clear All Records
            </button>
          )}
        </div>
        <div className="relative w-full sm:w-72">
          <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search by name or phone..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Attendee</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ticket Details</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Financials</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <i className="fa-solid fa-box-open text-4xl mb-3 block opacity-20"></i>
                  {bookings.length === 0 ? "No records in database yet." : "No bookings found matching your search."}
                </td>
              </tr>
            ) : (
              filtered.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{booking.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{booking.id.slice(0, 8)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-600 flex items-center gap-2">
                      <i className="fa-solid fa-phone text-xs text-indigo-400"></i>
                      {booking.phone}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`px-2 py-1 text-xs font-bold rounded-md ${
                        booking.ticketType === TicketType.STAG ? 'bg-orange-50 text-orange-600' :
                        booking.ticketType === TicketType.COUPLE ? 'bg-indigo-50 text-indigo-600' :
                        'bg-pink-50 text-pink-600'
                      }`}>
                        {booking.ticketType}
                      </span>
                      <span className="text-gray-500 text-sm">x {booking.quantity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex justify-between w-32">
                        <span className="text-xs text-gray-500">Paid:</span>
                        <span className="text-xs font-bold text-green-600">₹{booking.amountPaid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between w-32">
                        <span className="text-xs text-gray-500">Due:</span>
                        <span className={`text-xs font-bold ${booking.amountPending > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          ₹{booking.amountPending.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDelete(booking.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-all opacity-100 bg-transparent rounded-lg"
                      title="Delete Entry"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
