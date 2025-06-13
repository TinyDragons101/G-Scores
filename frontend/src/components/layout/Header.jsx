import React from 'react'
import { Menu } from 'lucide-react'

const Header = ({ onMenuClick }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 md:p-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">G-Scores</h1>
      </div>
    </div>
  );
};

export default Header