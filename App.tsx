
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
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed;
      }
      
      // Default data from the user provided image - Updated for composite types
      return [
        {
          id: 'seed-1',
          name: 'Ms.Deepa',
          phone: '9486610479',
          tickets: { [TicketType.ANGELS]: 1 },
          totalPax: 2,
          amountPaid: 2000,
          totalCost: 4000,
          amountPending: 2000,
          createdAt: Date.now() - 4000000
        },
        {
          id: 'seed-2',
          name: 'Ms.Akshaya',
          phone: '8270580083',
          tickets: { [TicketType.COUPLE]: 1 },
          totalPax: 2,
          amountPaid: 1200,
          totalCost: 1200,
          amountPending: 0,
          createdAt: Date.now() - 3000000
        },
        {
          id: 'seed-3',
          name: 'Mr.Kamalesh',
          phone: '9788724455',
          tickets: { [TicketType.COUPLE]: 1, [TicketType.STAG]: 2 },
          totalPax: 4,
          amountPaid: 9500,
          totalCost: 19000,
          amountPending: 9500,
          createdAt: Date.now() - 2000000
        },
        {
          id: 'seed-4',
          name: 'Mr.Alwin surya',
          phone: '8939159322',
          tickets: { [TicketType.COUPLE]: 1, [TicketType.STAG]: 1 },
          totalPax: 3,
          amountPaid: 12500,
          totalCost: 12500,
          amountPending: 0,
          createdAt: Date.now() - 1000000
        }
      ];
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

  const handleBulkAdd = (newBookings: Booking[]) => {
    const spaceRemaining = MAX_CAPACITY - bookings.length;
    const toAdd = newBookings.slice(0, spaceRemaining);
    setBookings(prev => [...toAdd, ...prev]);
    if (newBookings.length > spaceRemaining) {
      alert(`Only added ${spaceRemaining} records. Capacity limit reached.`);
    }
    setActiveTab('list');
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm("WARNING: This will permanently delete all records. Continue?")) {
      setBookings([]);
    }
  };

  const totals = useMemo(() => {
    return bookings.reduce((acc, curr) => ({
      paid: acc.paid + curr.amountPaid,
      pending: acc.pending + curr.amountPending,
      total: acc.total + curr.totalCost,
      count: acc.count + (curr.totalPax || 0)
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
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{booking.name}</p>
                            <p className="text-xs text-gray-500">
                              {Object.entries(booking.tickets)
                                .filter(([_, count]) => (count as number) > 0)
                                .map(([type, count]) => `${count}x ${type}`)
                                .join(', ')}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-400">₹{booking.amountPaid}</span>
                            <button 
                              onClick={() => handleDeleteBooking(booking.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1"
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
              onBulkAdd={handleBulkAdd}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
