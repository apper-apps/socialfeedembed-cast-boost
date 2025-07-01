import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import WidgetPreview from './WidgetPreview'

const ThemeSelector = ({ label, value, onChange, options = [], posts = [], className = '' }) => {
  const mockWidget = {
    name: 'Preview Widget',
    platforms: ['twitter', 'instagram'],
    theme: value,
    layout: 'grid',
    maxPosts: 3
  }

  const mockPosts = posts.length > 0 ? posts : [
    {
      Id: 1,
      platform: 'twitter',
      author: 'Design Studio',
      avatar: 'https://picsum.photos/40/40?random=1',
      content: 'Just launched our new design system! Clean, modern, and accessible. #design #ui',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 142,
      comments: 23,
      media: ['https://picsum.photos/300/200?random=1']
    },
    {
      Id: 2,
      platform: 'instagram',
      author: 'Creative Team',
      avatar: 'https://picsum.photos/40/40?random=2',
      content: 'Behind the scenes of our latest project ✨',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      likes: 89,
      comments: 12,
      media: ['https://picsum.photos/300/200?random=2']
    }
  ]

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
              className={`cursor-pointer transition-all duration-300 h-80 w-full ${
                value === option.value 
                  ? 'ring-2 ring-primary border-primary shadow-luxury' 
                  : 'hover:shadow-premium hover:border-gray-300'
              }`}
              onClick={() => onChange(option.value)}
              padding="none"
            >
              {/* Theme Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
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
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>

              {/* Theme Preview */}
<div className="p-4 flex-1 flex items-center">
                <div className="transform scale-95 origin-center w-full">
                  <WidgetPreview
                    widget={{...mockWidget, theme: option.value}}
                    posts={mockPosts}
                    theme={option.value}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ThemeSelector