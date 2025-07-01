import React, { useState } from 'react'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const FilterInput = ({ filters = [], onFiltersChange, selectedPlatforms = [], className = '' }) => {
  const [filterType, setFilterType] = useState('hashtag')
  const [filterValue, setFilterValue] = useState('')
  const [filterPlatform, setFilterPlatform] = useState('')
  const [filterMode, setFilterMode] = useState('include')

  const filterTypes = [
    { value: 'hashtag', label: 'Hashtag' },
    { value: 'username', label: 'Username' },
    { value: 'keyword', label: 'Keyword' }
  ]

  const filterModes = [
    { value: 'include', label: 'Include' },
    { value: 'exclude', label: 'Exclude' }
  ]

  const platformOptions = [
    { value: '', label: 'All Platforms' },
    ...selectedPlatforms.map(platform => ({
      value: platform,
      label: platform.charAt(0).toUpperCase() + platform.slice(1)
    }))
  ]

const handleAddFilter = () => {
    if (!filterValue.trim()) return

    const newFilter = {
      id: Date.now().toString(),
      type: filterType,
      value: filterValue.trim(),
      platform: filterPlatform || 'all',
      mode: filterMode
    }

    onFiltersChange([...filters, newFilter])
    setFilterValue('')
  }

  const handleRemoveFilter = (filterId) => {
    onFiltersChange(filters.filter(filter => filter.id !== filterId))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddFilter()
    }
  }

  return (
<div className={`${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Filters</h3>
<div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Select
            label="Filter Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            options={filterTypes}
          />
          <Select
            label="Mode"
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            options={filterModes}
          />
          <Select
            label="Platform"
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
options={platformOptions}
          />
          <div className="flex items-end md:col-span-2">
            <Input
              label="Filter Value"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Enter ${filterType}...`}
              className="flex-1"
            />
            <Button
              variant="primary"
              onClick={handleAddFilter}
              disabled={!filterValue.trim()}
              className="ml-2"
              icon="Plus"
            >
              Add
            </Button>
          </div>
        </div>

{filters.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Active Filters</h4>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Badge
                  key={filter.id}
                  variant={filter.mode === 'exclude' ? 'danger' : 'primary'}
                  className="flex items-center space-x-2"
                >
                  <span className="text-xs">
                    {filter.mode === 'exclude' ? 'Exclude' : 'Include'} {filter.type}: {filter.value}
                    {filter.platform !== 'all' && ` (${filter.platform})`}
                  </span>
                  <button
                    onClick={() => handleRemoveFilter(filter.id)}
                    className="ml-1 hover:text-error transition-colors"
                  >
                    <ApperIcon name="X" size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterInput