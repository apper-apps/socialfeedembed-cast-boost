import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Select = ({ 
  label, 
  options = [], 
  error, 
  className = '', 
  required = false,
  renderOption = null,
  isOpen = false,
  onToggle = null,
  ...props 
}) => {
  const selectClasses = `
    w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
    ${error ? 'border-error focus:border-error focus:ring-error/20' : 'border-gray-200 hover:border-gray-300'}
    bg-white text-gray-900 appearance-none cursor-pointer
  `

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
<div className="relative">
        {renderOption ? (
          <div className="relative">
            <button
              type="button"
              onClick={onToggle}
              className={selectClasses}
            >
              <div className="flex items-center justify-between">
                <span>{options.find(opt => opt.value === props.value)?.label || 'Select...'}</span>
                <ApperIcon 
                  name="ChevronDown" 
                  className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                  size={18} 
                />
              </div>
            </button>
            {isOpen && renderOption && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-luxury max-h-80 overflow-y-auto">
                {options.map((option) => renderOption(option, props.value === option.value))}
              </div>
            )}
          </div>
        ) : (
          <>
            <select
              className={selectClasses}
              required={required}
              {...props}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <ApperIcon name="ChevronDown" className="text-gray-400" size={18} />
            </div>
          </>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-error flex items-center">
          <ApperIcon name="AlertCircle" size={14} className="mr-1" />
          {error}
        </p>
      )}
    </div>
  )
}

export default Select