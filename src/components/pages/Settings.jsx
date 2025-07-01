import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Card from '@/components/atoms/Card'
import Checkbox from '@/components/atoms/Checkbox'
import Loading from '@/components/ui/Loading'
import ApperIcon from '@/components/ApperIcon'
import { settingsService } from '@/services/api/settingsService'

const Settings = () => {
  const [settings, setSettings] = useState({
    general: {
      siteName: '',
      siteUrl: '',
      defaultTheme: 'light',
      defaultLayout: 'grid',
      maxPostsPerWidget: 50
    },
    api: {
      twitterKey: '',
      instagramKey: '',
      facebookKey: '',
      youtubeKey: '',
      linkedinKey: '',
      enableCaching: true,
      cacheExpiration: 3600
    },
    notifications: {
      emailNotifications: true,
      widgetUpdates: true,
      systemAlerts: true,
      weeklyReports: false
    }
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const data = await settingsService.getSettings()
      setSettings(data)
    } catch (err) {
      toast.error('Failed to load settings')
      console.error('Error loading settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)
      await settingsService.updateSettings(settings)
      toast.success('Settings saved successfully')
    } catch (err) {
      toast.error('Failed to save settings')
      console.error('Error saving settings:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleGeneralChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [field]: value
      }
    }))
  }

  const handleApiChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      api: {
        ...prev.api,
        [field]: value
      }
    }))
  }

  const handleNotificationChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }))
  }

  const themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' }
  ]

  const layoutOptions = [
    { value: 'grid', label: 'Grid Layout' },
    { value: 'list', label: 'List Layout' },
    { value: 'masonry', label: 'Masonry Layout' }
  ]

  const cacheOptions = [
    { value: 1800, label: '30 minutes' },
    { value: 3600, label: '1 hour' },
    { value: 7200, label: '2 hours' },
    { value: 21600, label: '6 hours' },
    { value: 86400, label: '24 hours' }
  ]

  if (loading) {
    return <Loading type="settings" />
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and widget preferences</p>
        </div>
        <Button
          variant="primary"
          icon="Save"
          onClick={handleSaveSettings}
          loading={saving}
        >
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* General Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <ApperIcon name="Settings" className="text-primary" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Site Name"
              value={settings.general.siteName}
              onChange={(e) => handleGeneralChange('siteName', e.target.value)}
              placeholder="Enter your site name"
            />
            
            <Input
              label="Site URL"
              value={settings.general.siteUrl}
              onChange={(e) => handleGeneralChange('siteUrl', e.target.value)}
              placeholder="https://example.com"
            />
            
            <Select
              label="Default Layout"
              value={settings.general.defaultLayout}
              onChange={(e) => handleGeneralChange('defaultLayout', e.target.value)}
              options={layoutOptions}
            />
            
            <Input
              label="Max Posts Per Widget"
              type="number"
              value={settings.general.maxPostsPerWidget}
              onChange={(e) => handleGeneralChange('maxPostsPerWidget', parseInt(e.target.value))}
              min="1"
              max="100"
            />
          </div>
        </Card>

        {/* API Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-accent/10 to-emerald-500/10 rounded-lg">
              <ApperIcon name="Key" className="text-accent" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">API Configuration</h3>
          </div>
          
          <div className="space-y-4">
            <Input
              label="Twitter API Key"
              value={settings.api.twitterKey}
              onChange={(e) => handleApiChange('twitterKey', e.target.value)}
              placeholder="Enter Twitter API key"
              type="password"
            />
            
            <Input
              label="Instagram API Key"
              value={settings.api.instagramKey}
              onChange={(e) => handleApiChange('instagramKey', e.target.value)}
              placeholder="Enter Instagram API key"
              type="password"
            />
            
            <Input
              label="Facebook API Key"
              value={settings.api.facebookKey}
              onChange={(e) => handleApiChange('facebookKey', e.target.value)}
              placeholder="Enter Facebook API key"
              type="password"
            />
            
            <Input
              label="YouTube API Key"
              value={settings.api.youtubeKey}
              onChange={(e) => handleApiChange('youtubeKey', e.target.value)}
              placeholder="Enter YouTube API key"
              type="password"
            />
            
            <Input
              label="LinkedIn API Key"
              value={settings.api.linkedinKey}
              onChange={(e) => handleApiChange('linkedinKey', e.target.value)}
              placeholder="Enter LinkedIn API key"
              type="password"
            />
            
            <div className="pt-4 border-t border-gray-200">
              <Checkbox
                label="Enable Caching"
                checked={settings.api.enableCaching}
                onChange={(e) => handleApiChange('enableCaching', e.target.checked)}
              />
              
              {settings.api.enableCaching && (
                <div className="mt-4">
                  <Select
                    label="Cache Expiration"
                    value={settings.api.cacheExpiration}
                    onChange={(e) => handleApiChange('cacheExpiration', parseInt(e.target.value))}
                    options={cacheOptions}
                  />
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-warning/10 to-orange-500/10 rounded-lg">
              <ApperIcon name="Bell" className="text-warning" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <Checkbox
              label="Email Notifications"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => handleNotificationChange('emailNotifications', e.target.checked)}
            />
            
            <Checkbox
              label="Widget Updates"
              checked={settings.notifications.widgetUpdates}
              onChange={(e) => handleNotificationChange('widgetUpdates', e.target.checked)}
            />
            
            <Checkbox
              label="System Alerts"
              checked={settings.notifications.systemAlerts}
              onChange={(e) => handleNotificationChange('systemAlerts', e.target.checked)}
            />
            
            <Checkbox
              label="Weekly Reports"
              checked={settings.notifications.weeklyReports}
              onChange={(e) => handleNotificationChange('weeklyReports', e.target.checked)}
            />
          </div>
        </Card>
</div>

      {/* Theme Selector Section */}
      <div className="mt-8">
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg">
              <ApperIcon name="Palette" className="text-purple-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Theme Selection</h3>
              <p className="text-sm text-gray-600">Choose your preferred widget theme</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {themeOptions.map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all duration-300 h-48 ${
                    settings.general.defaultTheme === option.value 
                      ? 'ring-2 ring-primary border-primary shadow-luxury' 
                      : 'hover:shadow-premium hover:border-gray-300'
                  }`}
                  onClick={() => handleGeneralChange('defaultTheme', option.value)}
                  hover={true}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${
                          option.value === 'light' ? 'bg-yellow-400' : 'bg-gray-800'
                        }`} />
                        <h4 className="font-semibold text-gray-900">{option.label}</h4>
                      </div>
                      {settings.general.defaultTheme === option.value && (
                        <ApperIcon name="Check" className="text-primary" size={18} />
                      )}
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className={`w-full h-24 rounded-md ${
                        option.value === 'light' 
                          ? 'bg-gradient-to-br from-white to-gray-100 border border-gray-200' 
                          : 'bg-gradient-to-br from-gray-800 to-gray-900'
                      }`}>
                        <div className={`p-3 h-full flex flex-col justify-between ${
                          option.value === 'light' ? 'text-gray-800' : 'text-white'
                        }`}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              option.value === 'light' ? 'bg-primary' : 'bg-blue-400'
                            }`} />
                            <span className="text-xs font-medium">Preview</span>
                          </div>
                          <div className="space-y-1">
                            <div className={`h-1.5 rounded ${
                              option.value === 'light' ? 'bg-gray-300' : 'bg-gray-600'
                            }`} />
                            <div className={`h-1.5 w-3/4 rounded ${
                              option.value === 'light' ? 'bg-gray-200' : 'bg-gray-700'
                            }`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Settings */}
      <div className="mt-8">
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-error/10 to-red-600/10 rounded-lg">
              <ApperIcon name="Shield" className="text-error" size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Account & Security</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Data Management</h4>
              <div className="space-y-3">
                <Button variant="secondary" size="sm" icon="Download">
                  Export Data
                </Button>
                <Button variant="secondary" size="sm" icon="Upload">
                  Import Data
                </Button>
                <Button variant="secondary" size="sm" icon="RotateCcw">
                  Reset Settings
                </Button>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Danger Zone</h4>
              <div className="space-y-3">
                <Button variant="danger" size="sm" icon="Trash2">
                  Delete All Widgets
                </Button>
                <Button variant="danger" size="sm" icon="UserX">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Settings