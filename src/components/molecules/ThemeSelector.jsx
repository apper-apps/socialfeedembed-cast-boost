import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const ThemeSelector = ({ label, value, onChange, options = [], className = '' }) => {

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-4">
          {label}
        </label>
      )}
      
<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {options.map((option) => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
>
            <Card
              className={`cursor-pointer transition-all duration-300 ${
                value === option.value 
                  ? 'ring-2 ring-primary border-primary shadow-luxury' 
                  : 'hover:shadow-premium hover:border-gray-300'
              }`}
              onClick={() => onChange(option.value)}
              padding="p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full ${
                    option.value === 'minimal' ? 'bg-gray-100 border-2 border-gray-300' :
                    option.value === 'card' ? 'bg-gradient-to-r from-primary to-secondary' :
                    option.value === 'compact' ? 'bg-gray-600' :
                    'bg-gradient-to-r from-gray-900 to-gray-700'
                  }`} />
                  <h4 className="font-semibold text-gray-900">{option.label}</h4>
                </div>
                {value === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ApperIcon name="Check" className="text-primary" size={18} />
                  </motion.div>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{option.description}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ThemeSelector