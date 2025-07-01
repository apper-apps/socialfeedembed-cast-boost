import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = ({ 
  label, 
  checked = false, 
  onChange, 
  className = '', 
  disabled = false,
  ...props 
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <div
          className={`
            w-5 h-5 rounded border-2 transition-all duration-200 cursor-pointer
            ${checked 
              ? 'bg-gradient-to-r from-primary to-secondary border-primary' 
              : 'bg-white border-gray-300 hover:border-gray-400'
            }
${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            flex items-center justify-center
          `}
          onClick={!disabled ? (e) => {
            e.preventDefault();
            const syntheticEvent = {
              target: { checked: !checked },
              preventDefault: () => {},
              stopPropagation: () => {}
            };
            onChange?.(syntheticEvent);
          } : undefined}
        >
          {checked && (
            <ApperIcon name="Check" className="text-white" size={14} />
          )}
        </div>
      </div>
      {label && (
<label 
          className={`ml-3 text-sm text-gray-700 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={!disabled ? (e) => {
            e.preventDefault();
            const syntheticEvent = {
              target: { checked: !checked },
              preventDefault: () => {},
              stopPropagation: () => {}
            };
            onChange?.(syntheticEvent);
          } : undefined}
>
          {label}
        </label>
      )}
    </div>
  )
}

export default Checkbox