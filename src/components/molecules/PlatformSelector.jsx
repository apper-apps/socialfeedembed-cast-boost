import React from 'react'
import { motion } from 'framer-motion'
import Checkbox from '@/components/atoms/Checkbox'
import ApperIcon from '@/components/ApperIcon'

const platforms = [
  { id: 'twitter', name: 'Twitter', icon: 'Twitter', color: 'twitter' },
  { id: 'instagram', name: 'Instagram', icon: 'Instagram', color: 'instagram' },
  { id: 'facebook', name: 'Facebook', icon: 'Facebook', color: 'facebook' },
  { id: 'tiktok', name: 'TikTok', icon: 'Music', color: 'tiktok' },
  { id: 'youtube', name: 'YouTube', icon: 'Youtube', color: 'youtube' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', color: 'linkedin' }
]

const PlatformSelector = ({ selectedPlatforms = [], onPlatformChange, className = '' }) => {
  const handlePlatformToggle = (platformId) => {
    const isSelected = selectedPlatforms.includes(platformId)
    if (isSelected) {
      onPlatformChange(selectedPlatforms.filter(id => id !== platformId))
    } else {
      onPlatformChange([...selectedPlatforms, platformId])
    }
  }

  return (
    <div className={`${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Platforms</h3>
      <div className="grid grid-cols-2 gap-3">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id)
          return (
            <motion.div
              key={platform.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                ${isSelected 
                  ? `border-${platform.color} bg-gradient-to-r from-${platform.color}/5 to-${platform.color}/10` 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
              onClick={() => handlePlatformToggle(platform.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${isSelected ? `text-${platform.color}` : 'text-gray-400'}`}>
                  <ApperIcon name={platform.icon} size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{platform.name}</h4>
                </div>
                <Checkbox
                  checked={isSelected}
                  onChange={() => handlePlatformToggle(platform.id)}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default PlatformSelector