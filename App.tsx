
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Stats } from './components/Stats';
import { BookingForm } from './components/BookingForm';
import { BookingTable } from './components/BookingTable';
import { AIInsights } from './components/AIInsights';
import { Booking, TicketType } from './types';
import { MAX_CAPACITY } from './constants';

const App: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('event_bookings');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load bookings", e);
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'list' | 'add'>('dashboard');

  useEffect(() => {
    localStorage.setItem('event_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const handleAddBooking = (newBooking: Booking) => {
    if (bookings.length >= MAX_CAPACITY) {
      alert("Capacity limit reached! Cannot add more bookings.");
      return;
    }
    setBookings(prev => [newBooking, ...prev]);
    setActiveTab('list');
  };

  const handleDeleteBooking = (id: string) => {
    // Confirmation removed for "fast" action as requested
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm("WARNING: This will permanently delete all records in your database. Continue?")) {
      setBookings([]);
    }
  };

  const totals = useMemo(() => {
    return bookings.reduce((acc, curr) => ({
      paid: acc.paid + curr.amountPaid,
      pending: acc.pending + curr.amountPending,
      total: acc.total + curr.totalCost,
      count: acc.count + (curr.quantity || 0)
    }), { paid: 0, pending: 0, total: 0, count: 0 });
  }, [bookings]);

  return (
    <div className="min-h-screen pb-12 bg-gray-50">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentCount={bookings.length} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <Stats totals={totals} bookingCount={bookings.length} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <AIInsights bookings={bookings} />
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <i className="fa-solid fa-clock-rotate-left text-indigo-500"></i>
                    Recent Activity
                  </h3>
                  {bookings.length === 0 ? (
                    <p className="text-gray-500 italic">No bookings recorded yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {bookings.slice(0, 5).map(booking => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                          <div>
                            <p className="font-medium text-gray-900">{booking.name}</p>
                            <p className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.ticketType === TicketType.STAG ? 'bg-orange-100 text-orange-700' :
                              booking.ticketType === TicketType.COUPLE ? 'bg-indigo-100 text-indigo-700' :
                              'bg-pink-100 text-pink-700'
                            }`}>
                              {booking.ticketType}
                            </span>
                            <button 
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              title="Delete booking"
                            >
                              <i className="fa-solid fa-trash-can text-sm"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-8">
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold mb-2">Capacity Check</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min(100, (bookings.length / MAX_CAPACITY) * 100)}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      {bookings.length} of {MAX_CAPACITY} slots used ({((bookings.length / MAX_CAPACITY) * 100).toFixed(1)}%)
                    </p>
                 </div>
                 <button 
                  onClick={() => setActiveTab('add')}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                 >
                   <i className="fa-solid fa-plus"></i>
                   New Booking Entry
                 </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="max-w-2xl mx-auto">
            <BookingForm onAdd={handleAddBooking} onCancel={() => setActiveTab('dashboard')} />
          </div>
        )}

        {activeTab === 'list' && (
          <div>
            <BookingTable 
              bookings={bookings} 
              onDelete={handleDeleteBooking} 
              onClearAll={handleClearAll}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
