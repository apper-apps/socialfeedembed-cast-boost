import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = 'Something went wrong', onRetry, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
    >
      <div className="p-4 bg-gradient-to-r from-error/10 to-red-600/10 rounded-full mb-4">
        <ApperIcon name="AlertTriangle" className="text-error" size={48} />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      
      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          icon="RefreshCw"
          className="shadow-lg hover:shadow-xl"
        >
          Try Again
        </Button>
      )}
    </motion.div>
  )
}

export default Error