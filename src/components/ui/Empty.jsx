import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  icon = 'Inbox', 
  title = 'No items found', 
  description = 'Get started by creating your first item',
  actionLabel = 'Get Started',
  onAction,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full mb-6">
        <ApperIcon name={icon} className="text-primary" size={64} />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md text-lg">{description}</p>
      
      {onAction && (
        <Button
          variant="primary"
          size="lg"
          onClick={onAction}
          icon="Plus"
          className="shadow-luxury hover:shadow-xl"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  )
}

export default Empty