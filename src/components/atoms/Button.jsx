import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon, 
  iconPosition = 'left',
  className = '', 
  disabled = false,
  loading = false,
  onClick,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/25 focus:ring-primary/50 hover:brightness-110",
    secondary: "bg-surface text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md focus:ring-primary/50",
    accent: "bg-gradient-to-r from-accent to-emerald-500 text-white hover:shadow-lg hover:shadow-accent/25 focus:ring-accent/50 hover:brightness-110",
    danger: "bg-gradient-to-r from-error to-red-600 text-white hover:shadow-lg hover:shadow-error/25 focus:ring-error/50 hover:brightness-110",
    ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-primary/50",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50"
  }
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  }
  
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="animate-spin mr-2" size={iconSizes[size]} />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon name={icon} className="mr-2" size={iconSizes[size]} />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon name={icon} className="ml-2" size={iconSizes[size]} />
      )}
    </motion.button>
  )
}

export default Button