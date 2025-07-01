import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Input from '@/components/atoms/Input'
import ApperIcon from '@/components/ApperIcon'

const EmbedCodeModal = ({ isOpen, onClose, widget }) => {
  const [embedOptions, setEmbedOptions] = useState({
    width: '100%',
    height: '400px',
    theme: 'light',
    showHeader: true
  })

  const generateEmbedCode = () => {
    const params = new URLSearchParams({
      id: widget.Id,
      width: embedOptions.width,
      height: embedOptions.height,
      theme: embedOptions.theme,
      showHeader: embedOptions.showHeader
    })

    return `<iframe
  src="https://socialfeedembed.com/embed?${params.toString()}"
  width="${embedOptions.width}"
  height="${embedOptions.height}"
  frameborder="0"
  scrolling="no"
  style="border: none; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
  title="${widget.name} - Social Feed Widget">
</iframe>`
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode())
      toast.success('Embed code copied to clipboard!')
    } catch (err) {
      toast.error('Failed to copy code')
    }
  }

  const sizeOptions = [
    { value: '100%', label: 'Responsive (100%)' },
    { value: '320px', label: 'Mobile (320px)' },
    { value: '480px', label: 'Small (480px)' },
    { value: '640px', label: 'Medium (640px)' },
    { value: '800px', label: 'Large (800px)' },
    { value: '1024px', label: 'Extra Large (1024px)' }
  ]

  const heightOptions = [
    { value: '300px', label: 'Compact (300px)' },
    { value: '400px', label: 'Standard (400px)' },
    { value: '500px', label: 'Tall (500px)' },
    { value: '600px', label: 'Extra Tall (600px)' }
  ]

  const themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' }
  ]

  if (!widget) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-luxury max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Embed Code</h2>
                  <p className="text-gray-600">Copy this code to embed your widget</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                />
              </div>

              <div className="space-y-6">
                {/* Embed Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Width"
                    value={embedOptions.width}
                    onChange={(e) => setEmbedOptions(prev => ({ ...prev, width: e.target.value }))}
                    options={sizeOptions}
                  />
                  <Select
                    label="Height"
                    value={embedOptions.height}
                    onChange={(e) => setEmbedOptions(prev => ({ ...prev, height: e.target.value }))}
                    options={heightOptions}
                  />
                  <Select
                    label="Theme"
                    value={embedOptions.theme}
                    onChange={(e) => setEmbedOptions(prev => ({ ...prev, theme: e.target.value }))}
                    options={themeOptions}
                  />
                  <div className="flex items-center space-x-3 pt-6">
                    <input
                      type="checkbox"
                      id="showHeader"
                      checked={embedOptions.showHeader}
                      onChange={(e) => setEmbedOptions(prev => ({ ...prev, showHeader: e.target.checked }))}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="showHeader" className="text-sm font-medium text-gray-700">
                      Show Header
                    </label>
                  </div>
                </div>

                {/* Embed Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Embed Code
                  </label>
                  <div className="relative">
                    <textarea
                      value={generateEmbedCode()}
                      readOnly
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      icon="Copy"
                      onClick={handleCopyCode}
                      className="absolute top-2 right-2"
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center space-x-2 mb-3">
                        <ApperIcon name="Rss" className="text-primary" size={20} />
                        <h3 className="font-semibold text-gray-900">{widget.name}</h3>
                      </div>
                      <div className="text-sm text-gray-600">
                        Widget will appear here with dimensions: {embedOptions.width} × {embedOptions.height}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <Button variant="secondary" onClick={onClose}>
                  Close
                </Button>
                <Button variant="primary" icon="Copy" onClick={handleCopyCode}>
                  Copy Embed Code
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default EmbedCodeModal