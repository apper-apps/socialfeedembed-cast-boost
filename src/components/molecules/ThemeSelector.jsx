import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import WidgetPreview from './WidgetPreview'

const ThemeSelector = ({ label, value, onChange, options = [], posts = [], className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const selectedOption = options.find(opt => opt.value === value) || options[0]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
    <div className={`${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-gray-900 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${
                value === 'minimal' ? 'bg-gray-100 border-2 border-gray-300' :
                value === 'card' ? 'bg-gradient-to-r from-primary to-secondary' :
                value === 'compact' ? 'bg-gray-600' :
                'bg-gradient-to-r from-gray-900 to-gray-700'
              }`} />
              <span className="font-medium">{selectedOption?.label}</span>
            </div>
            <ApperIcon 
              name="ChevronDown" 
              className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              size={18} 
            />
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-luxury overflow-hidden"
            >
              <div className="max-h-96 overflow-y-auto">
                {options.map((option) => (
                  <div key={option.value} className="border-b border-gray-100 last:border-b-0">
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option.value)
                        setIsOpen(false)
                      }}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                        value === option.value ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        {/* Theme info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-4 h-4 rounded-full ${
                              option.value === 'minimal' ? 'bg-gray-100 border-2 border-gray-300' :
                              option.value === 'card' ? 'bg-gradient-to-r from-primary to-secondary' :
                              option.value === 'compact' ? 'bg-gray-600' :
                              'bg-gradient-to-r from-gray-900 to-gray-700'
                            }`} />
                            <h4 className="font-semibold text-gray-900">{option.label}</h4>
                            {value === option.value && (
                              <ApperIcon name="Check" className="text-primary" size={16} />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                        </div>

                        {/* Mini preview */}
                        <div className="w-48 flex-shrink-0">
                          <div className="transform scale-75 origin-top-right">
                            <WidgetPreview
                              widget={mockWidget}
                              posts={mockPosts}
                              theme={option.value}
                              className="w-64"
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ThemeSelector