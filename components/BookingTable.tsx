
import React, { useState, useRef } from 'react';
import { Booking, TicketType } from '../types';
import { parseBookingImage } from '../services/visionService';

interface BookingTableProps {
  bookings: Booking[];
  onDelete: (id: string) => void;
  onClearAll?: () => void;
  onBulkAdd?: (bookings: Booking[]) => void;
}

export const BookingTable: React.FC<BookingTableProps> = ({ bookings, onDelete, onClearAll, onBulkAdd }) => {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = bookings.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.phone.includes(search)
  );

  const handleCopyDatabase = async () => {
    if (bookings.length === 0) return;
    try {
      const dataString = JSON.stringify(bookings, null, 2);
      await navigator.clipboard.writeText(dataString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy database: ', err);
    }
  };

  const handleExportExcel = () => {
    if (bookings.length === 0) return;
    const headers = ['ID', 'Name', 'Phone', 'Tickets', 'Total Pax', 'Amount Paid', 'Amount Pending', 'Total Cost', 'Date Created'];
    const rows = bookings.map(b => [
      b.id,
      `"${b.name.replace(/"/g, '""')}"`,
      `'${b.phone}`,
      `"${Object.entries(b.tickets).filter(([_, q]) => (q as number) > 0).map(([t, q]) => `${q} ${t}`).join(', ')}"`,
      b.totalPax,
      b.amountPaid,
      b.amountPending,
      b.totalCost,
      new Date(b.createdAt).toLocaleString()
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onBulkAdd) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64 = event.target?.result as string;
        const results = await parseBookingImage(base64);
        onBulkAdd(results);
      } catch (err: any) {
        alert(err.message || "Failed to scan image.");
      } finally {
        setIsScanning(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-fadeIn">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-gray-900">Booking Database</h2>
          <div className="flex flex-wrap items-center gap-4 mt-1">
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 ${isScanning ? 'text-gray-400' : 'text-purple-600 hover:text-purple-800'}`}
            >
              <i className={`fa-solid ${isScanning ? 'fa-spinner fa-spin' : 'fa-camera-retro'}`}></i>
              {isScanning ? 'Scanning...' : 'Scan Image'}
            </button>
            {bookings.length > 0 && (
              <>
                <button 
                  onClick={handleExportExcel}
                  className="text-xs font-semibold text-green-600 hover:text-green-800 uppercase tracking-wider transition-colors flex items-center gap-1"
                >
                  <i className="fa-solid fa-file-excel"></i>
                  Excel
                </button>
                <button 
                  onClick={handleCopyDatabase}
                  className={`text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 ${copied ? 'text-green-600' : 'text-indigo-600 hover:text-indigo-800'}`}
                >
                  <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                  {copied ? 'Copied!' : 'Copy JSON'}
                </button>
                {onClearAll && (
                  <button 
                    onClick={onClearAll}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors uppercase tracking-wider flex items-center gap-1"
                  >
                    <i className="fa-solid fa-trash-sweep"></i>
                    Clear All
                  </button>
                )}
              </>
            )}
          </div>
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
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Guest</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ticket Mix</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Pax</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Financials</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <i className="fa-solid fa-box-open text-4xl mb-3 block opacity-20"></i>
                  {bookings.length === 0 ? "No records yet." : "No results."}
                </td>
              </tr>
            ) : (
              filtered.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{booking.name}</p>
                    <p className="text-xs text-gray-500">{booking.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(booking.tickets).map(([type, qty]) => (qty as number) > 0 && (
                        <span key={type} className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                          type === TicketType.STAG ? 'bg-orange-100 text-orange-700' :
                          type === TicketType.COUPLE ? 'bg-indigo-100 text-indigo-700' :
                          'bg-pink-100 text-pink-700'
                        }`}>
                          {qty} {type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-700">{booking.totalPax}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <p className="text-green-600 font-bold">Paid: ₹{booking.amountPaid.toLocaleString()}</p>
                      {booking.amountPending > 0 && (
                        <p className="text-red-500">Due: ₹{booking.amountPending.toLocaleString()}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onDelete(booking.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-all"
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
