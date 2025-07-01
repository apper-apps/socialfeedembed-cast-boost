import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import EmbedCodeModal from '@/components/molecules/EmbedCodeModal'
import ApperIcon from '@/components/ApperIcon'
import { widgetService } from '@/services/api/widgetService'

const WidgetDashboard = () => {
  const navigate = useNavigate()
  const [widgets, setWidgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedWidget, setSelectedWidget] = useState(null)
  const [showEmbedModal, setShowEmbedModal] = useState(false)

  useEffect(() => {
    loadWidgets()
  }, [])

  const loadWidgets = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await widgetService.getAll()
      setWidgets(data)
    } catch (err) {
      setError('Failed to load widgets. Please try again.')
      console.error('Error loading widgets:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteWidget = async (widgetId) => {
    if (!window.confirm('Are you sure you want to delete this widget?')) return

try {
      await widgetService.delete(widgetId)
      setWidgets(widgets.filter(w => (w.id || w.Id) !== widgetId))
      toast.success('Widget deleted successfully')
    } catch (err) {
      toast.error('Failed to delete widget')
      console.error('Error deleting widget:', err)
    }
  }

  const handleShowEmbed = (widget) => {
    setSelectedWidget(widget)
    setShowEmbedModal(true)
  }

  const handleEditWidget = (widgetId) => {
    navigate(`/edit-widget/${widgetId}`)
  }

const getPlatformColor = (platform) => {
    const colors = {
      twitter: 'x',
      instagram: 'instagram',
      facebook: 'facebook',
      tiktok: 'tiktok',
      youtube: 'youtube',
      linkedin: 'linkedin'
    }
    return colors[platform] || 'primary'
  }

const getPlatformIcon = (platform) => {
    const icons = {
      twitter: 'X',
      instagram: 'Instagram',
      facebook: 'Facebook',
      tiktok: 'Music',
      youtube: 'Youtube',
      linkedin: 'Linkedin'
    }
    return icons[platform] || 'Globe'
  }

  if (loading) {
    return <Loading type="widgets" />
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadWidgets} />
      </div>
    )
  }

  if (widgets.length === 0) {
    return (
      <div className="p-6">
        <Empty
          icon="LayoutGrid"
          title="No widgets created yet"
          description="Create your first social media widget to get started with embedding feeds on your website"
          actionLabel="Create Widget"
          onAction={() => navigate('/create-widget')}
        />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Widgets</h1>
          <p className="text-gray-600 mt-1">Manage your social media feed widgets</p>
        </div>
        <Button
          variant="primary"
          size="lg"
          icon="Plus"
          onClick={() => navigate('/create-widget')}
          className="shadow-lg hover:shadow-xl"
        >
          Create Widget
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
{widgets.map((widget, index) => (
          <motion.div
            key={widget.id || widget.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
                    <ApperIcon name="LayoutGrid" className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{widget.name}</h3>
                    <p className="text-sm text-gray-600">{widget.layout} layout</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
icon="Edit"
                    onClick={() => handleEditWidget(widget.id || widget.Id)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
icon="Trash2"
                    onClick={() => handleDeleteWidget(widget.id || widget.Id)}
                    className="text-error hover:text-error"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {/* Platforms */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Platforms</p>
                  <div className="flex flex-wrap gap-2">
                    {widget.platforms.map((platform) => (
                      <Badge
                        key={platform}
                        variant={getPlatformColor(platform)}
                        size="sm"
                      >
                        <ApperIcon name={getPlatformIcon(platform)} size={12} className="mr-1" />
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Filters */}
                {widget.filters && widget.filters.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Filters</p>
                    <div className="flex flex-wrap gap-2">
                      {widget.filters.slice(0, 3).map((filter, index) => (
                        <Badge key={index} variant="default" size="sm">
                          {filter.type}: {filter.value}
                        </Badge>
                      ))}
                      {widget.filters.length > 3 && (
                        <Badge variant="default" size="sm">
                          +{widget.filters.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{widget.maxPosts}</p>
                    <p className="text-sm text-gray-600">Max Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{widget.platforms.length}</p>
                    <p className="text-sm text-gray-600">Platforms</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    variant="primary"
                    size="sm"
                    icon="Code"
                    onClick={() => handleShowEmbed(widget)}
                    className="flex-1"
                  >
                    Get Embed Code
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
icon="ExternalLink"
                    onClick={() => handleEditWidget(widget.id || widget.Id)}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Embed Modal */}
      <EmbedCodeModal
        isOpen={showEmbedModal}
        onClose={() => setShowEmbedModal(false)}
        widget={selectedWidget}
      />
    </div>
  )
}

export default WidgetDashboard