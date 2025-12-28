
import React, { useState, useEffect } from 'react';
import { getSmartInsights } from '../services/geminiService';
import { Booking } from '../types';

interface AIInsightsProps {
  bookings: Booking[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ bookings }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    if (bookings.length === 0) return;
    setLoading(true);
    const result = await getSmartInsights(bookings);
    setInsight(result || 'No insights available.');
    setLoading(false);
  };

  useEffect(() => {
    if (bookings.length > 0 && !insight) {
      fetchInsight();
    }
  }, [bookings]);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl text-white shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <i className="fa-solid fa-wand-magic-sparkles text-yellow-300"></i>
          AI Sales Advisor
        </h3>
        <button 
          onClick={fetchInsight}
          disabled={loading || bookings.length === 0}
          className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Refresh Insight'}
        </button>
      </div>

      {bookings.length === 0 ? (
        <p className="text-indigo-100 text-sm italic">
          Once you start adding bookings, I'll provide strategic sales insights here.
        </p>
      ) : (
        <div className="relative">
          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-white/20 rounded w-full"></div>
              <div className="h-4 bg-white/20 rounded w-5/6"></div>
              <div className="h-4 bg-white/20 rounded w-4/6"></div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-indigo-50 leading-relaxed font-medium">
              {insight}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
