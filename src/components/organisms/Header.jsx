import React from 'react'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Header = ({ onMenuClick, title, actions }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              icon="Menu"
              onClick={onMenuClick}
              className="lg:hidden"
            />
            {title && (
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {actions}
            <div className="hidden sm:flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
                <ApperIcon name="Zap" className="text-primary" size={18} />
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Pro Plan</p>
                <p className="text-gray-500">Unlimited widgets</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header