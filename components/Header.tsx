
import React from 'react';

interface HeaderProps {
  activeTab: 'dashboard' | 'list' | 'add';
  setActiveTab: (tab: 'dashboard' | 'list' | 'add') => void;
  currentCount: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, currentCount }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <i className="fa-solid fa-ticket text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">EventEase Pro</h1>
          </div>

          <nav className="flex space-x-1 sm:space-x-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'list' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Database ({currentCount})
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'add' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Add New
            </button>
          </nav>

          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-xs text-gray-500 uppercase font-semibold">Admin Panel</p>
                <p className="text-sm font-medium text-gray-900">Elite Events Management</p>
             </div>
             <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white overflow-hidden shadow-sm">
                <img src="https://picsum.photos/32/32" alt="Avatar" />
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};
