import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Input = ({ 
  label, 
  icon, 
  error, 
  className = '', 
  type = 'text',
  required = false,
  variant,
  value,
  onChange,
  ...props
}) => {
const inputClasses = `
    w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
    ${error ? 'border-error focus:border-error focus:ring-error/20' : 'border-gray-200 hover:border-gray-300'}
    ${icon ? 'pl-12' : ''}
    bg-white placeholder-gray-400 text-gray-900
  `

  const sliderClasses = `
    w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200
    focus:outline-none focus:ring-2 focus:ring-primary/20
    slider-thumb:appearance-none slider-thumb:w-4 slider-thumb:h-4 
    slider-thumb:rounded-full slider-thumb:bg-primary slider-thumb:cursor-pointer
  `

return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
          {variant === 'slider' && value !== undefined && (
            <span className="ml-2 text-primary font-semibold">{value}</span>
          )}
        </label>
      )}
      <div className="relative">
        {variant === 'slider' ? (
          <>
            <input
              type="range"
              className={sliderClasses}
              value={value}
              onChange={onChange}
              required={required}
              {...props}
            />
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #3b82f6;
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              input[type="range"]::-moz-range-thumb {
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #3b82f6;
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
            `}</style>
          </>
        ) : (
          <>
            {icon && (
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ApperIcon name={icon} className="text-gray-400" size={18} />
              </div>
            )}
            <input
              type={type}
              className={inputClasses}
              value={value}
              onChange={onChange}
              required={required}
              {...props}
            />
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

export default Input