import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const navigation = [
    { name: 'Widgets', href: '/widgets', icon: 'LayoutGrid' },
    { name: 'Create Widget', href: '/create-widget', icon: 'Plus' },
    { name: 'Analytics', href: '/analytics', icon: 'BarChart3' },
    { name: 'Settings', href: '/settings', icon: 'Settings' }
  ]

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-luxury z-50 lg:static lg:translate-x-0 lg:shadow-none"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
                <ApperIcon name="Rss" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">SocialFeed</h1>
                <p className="text-sm text-gray-600">Embed</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href === '/widgets' && location.pathname === '/')
                
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    <ApperIcon name={item.icon} size={20} />
                    <span className="font-medium">{item.name}</span>
                  </NavLink>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Made with ❤️ for creators
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar