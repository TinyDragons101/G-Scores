import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  
  const menuItems = [
    { path: '/', label: 'Dashboard'},
    { path: '/search', label: 'Search Scores'},
    { path: '/reports', label: 'Reports'},
    { path: '/settings', label: 'Settings'}
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed md:static
        top-0 left-0
        w-64 h-full
        bg-gradient-to-b from-yellow-400 to-green-500
        transform transition-transform duration-300 ease-in-out z-30
        min-h-screen
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4 md:p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button 
              onClick={onClose}
              className="md:hidden p-2 hover:bg-white hover:bg-opacity-20 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>
          <nav>
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => onClose()}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-white bg-opacity-20 text-gray-900 font-medium' 
                          : 'text-gray-800 hover:bg-white hover:bg-opacity-10'
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar