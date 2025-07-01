import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Layout from "@/components/organisms/Layout";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import Loading from "@/components/ui/Loading";
import { settingsService } from "@/services/api/settingsService";

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
    },
    style: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb'
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: 400,
        lineHeight: 1.5
      },
      spacing: {
        padding: 16,
        margin: 16,
        gap: 8
      },
      borders: {
        width: 1,
        radius: 8,
        style: 'solid'
      }
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

  const handleStyleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      style: {
        ...prev.style,
        [field]: {
          ...prev.style[field],
          ...value
        }
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
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Default Layout
              </label>
              <Select
                value={settings.general.defaultLayout}
                onChange={(e) => handleGeneralChange('defaultLayout', e.target.value)}
                options={layoutOptions}
                renderLayoutOption={(option, isSelected) => (
                  <div
                    key={option.value}
                    className={`cursor-pointer transition-all duration-300 p-4 rounded-lg border-2 ${
                      isSelected 
                        ? 'ring-2 ring-primary border-primary shadow-luxury bg-primary/5' 
                        : 'border-gray-200 hover:shadow-premium hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => handleGeneralChange('defaultLayout', option.value)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="p-1.5 bg-gray-100 rounded-md">
                          <ApperIcon 
                            name={option.value === 'grid' ? 'Grid3X3' : option.value === 'list' ? 'List' : 'Layers'} 
                            className="text-gray-600" 
                            size={16} 
                          />
                        </div>
                        <h4 className="font-semibold text-gray-900">{option.label}</h4>
                      </div>
                      {isSelected && (
                        <ApperIcon name="Check" className="text-primary" size={18} />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-center bg-gray-50 rounded-lg p-3 h-16">
                      {option.value === 'grid' && (
                        <div className="w-full h-12 grid grid-cols-3 gap-1">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-sm shadow-sm" />
                          ))}
                        </div>
                      )}
                      {option.value === 'list' && (
                        <div className="w-full h-12 space-y-1">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-2 bg-white border border-gray-200 rounded-sm p-1">
                              <div className="w-6 h-6 bg-gray-300 rounded-sm flex-shrink-0" />
                              <div className="flex-1 space-y-0.5">
                                <div className="h-1.5 bg-gray-300 rounded w-3/4" />
                                <div className="h-1 bg-gray-200 rounded w-1/2" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {option.value === 'masonry' && (
                        <div className="w-full h-12 grid grid-cols-3 gap-1">
                          <div className="space-y-1">
                            <div className="bg-white border border-gray-200 rounded-sm h-6" />
                            <div className="bg-white border border-gray-200 rounded-sm h-4" />
                          </div>
                          <div className="space-y-1">
                            <div className="bg-white border border-gray-200 rounded-sm h-4" />
                            <div className="bg-white border border-gray-200 rounded-sm h-6" />
                          </div>
                          <div className="space-y-1">
                            <div className="bg-white border border-gray-200 rounded-sm h-8" />
                            <div className="bg-white border border-gray-200 rounded-sm h-2" />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">
                        {option.value === 'grid' && 'Equal-sized cards'}
                        {option.value === 'list' && 'Vertical arrangement'}
                        {option.value === 'masonry' && 'Dynamic heights'}
                      </p>
                    </div>
                  </div>
                )}
              />
            </div>
            
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

      {/* Advanced Style Editor */}
      <div className="mt-8">
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg">
              <ApperIcon name="Paintbrush" className="text-indigo-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Style Customization</h3>
              <p className="text-sm text-gray-600">Customize colors, fonts, spacing, and borders to match your branding</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Colors Section */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Palette" className="text-gray-600 mr-2" size={16} />
                Colors
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Primary Color"
                    value={settings.style.colors.primary}
                    onChange={(color) => handleStyleChange('colors', { primary: color })}
                    colorPicker={true}
                  />
                  <Select
                    label="Secondary Color"
                    value={settings.style.colors.secondary}
                    onChange={(color) => handleStyleChange('colors', { secondary: color })}
                    colorPicker={true}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Accent Color"
                    value={settings.style.colors.accent}
                    onChange={(color) => handleStyleChange('colors', { accent: color })}
                    colorPicker={true}
                  />
                  <Select
                    label="Background Color"
                    value={settings.style.colors.background}
                    onChange={(color) => handleStyleChange('colors', { background: color })}
                    colorPicker={true}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Text Color"
                    value={settings.style.colors.text}
                    onChange={(color) => handleStyleChange('colors', { text: color })}
                    colorPicker={true}
                  />
                  <Select
                    label="Border Color"
                    value={settings.style.colors.border}
                    onChange={(color) => handleStyleChange('colors', { border: color })}
                    colorPicker={true}
                  />
                </div>
              </div>
            </div>

            {/* Typography Section */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Type" className="text-gray-600 mr-2" size={16} />
                Typography
              </h4>
              <div className="space-y-4">
                <Select
                  label="Font Family"
                  value={settings.style.typography.fontFamily}
                  onChange={(e) => handleStyleChange('typography', { fontFamily: e.target.value })}
                  options={[
                    { value: 'Inter', label: 'Inter' },
                    { value: 'Roboto', label: 'Roboto' },
                    { value: 'Open Sans', label: 'Open Sans' },
                    { value: 'Lato', label: 'Lato' },
                    { value: 'Montserrat', label: 'Montserrat' },
                    { value: 'Poppins', label: 'Poppins' }
                  ]}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Font Size (px)"
                    type="range"
                    min="12"
                    max="24"
                    value={settings.style.typography.fontSize}
                    onChange={(e) => handleStyleChange('typography', { fontSize: parseInt(e.target.value) })}
                    variant="slider"
                  />
                  <Input
                    label="Font Weight"
                    type="range"
                    min="300"
                    max="700"
                    step="100"
                    value={settings.style.typography.fontWeight}
                    onChange={(e) => handleStyleChange('typography', { fontWeight: parseInt(e.target.value) })}
                    variant="slider"
                  />
                </div>
                <Input
                  label="Line Height"
                  type="range"
                  min="1.2"
                  max="2"
                  step="0.1"
                  value={settings.style.typography.lineHeight}
                  onChange={(e) => handleStyleChange('typography', { lineHeight: parseFloat(e.target.value) })}
                  variant="slider"
                />
              </div>
            </div>

            {/* Spacing Section */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Move" className="text-gray-600 mr-2" size={16} />
                Spacing
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    label="Padding (px)"
                    type="range"
                    min="8"
                    max="32"
                    value={settings.style.spacing.padding}
                    onChange={(e) => handleStyleChange('spacing', { padding: parseInt(e.target.value) })}
                    variant="slider"
                  />
                  <Input
                    label="Margin (px)"
                    type="range"
                    min="8"
                    max="32"
                    value={settings.style.spacing.margin}
                    onChange={(e) => handleStyleChange('spacing', { margin: parseInt(e.target.value) })}
                    variant="slider"
                  />
                  <Input
                    label="Gap (px)"
                    type="range"
                    min="4"
                    max="24"
                    value={settings.style.spacing.gap}
                    onChange={(e) => handleStyleChange('spacing', { gap: parseInt(e.target.value) })}
                    variant="slider"
                  />
                </div>
              </div>
            </div>

            {/* Borders Section */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Square" className="text-gray-600 mr-2" size={16} />
                Borders
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Border Width (px)"
                    type="range"
                    min="0"
                    max="8"
                    value={settings.style.borders.width}
                    onChange={(e) => handleStyleChange('borders', { width: parseInt(e.target.value) })}
                    variant="slider"
                  />
                  <Input
                    label="Border Radius (px)"
                    type="range"
                    min="0"
                    max="24"
                    value={settings.style.borders.radius}
                    onChange={(e) => handleStyleChange('borders', { radius: parseInt(e.target.value) })}
                    variant="slider"
                  />
                </div>
                <Select
                  label="Border Style"
                  value={settings.style.borders.style}
                  onChange={(e) => handleStyleChange('borders', { style: e.target.value })}
                  options={[
                    { value: 'solid', label: 'Solid' },
                    { value: 'dashed', label: 'Dashed' },
                    { value: 'dotted', label: 'Dotted' },
                    { value: 'none', label: 'None' }
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Style Preview */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Eye" className="text-gray-600 mr-2" size={16} />
              Live Preview
            </h4>
            <div 
              className="p-6 rounded-lg border-2 transition-all duration-200"
              style={{
                backgroundColor: settings.style.colors.surface,
                borderColor: settings.style.colors.border,
                borderWidth: `${settings.style.borders.width}px`,
                borderRadius: `${settings.style.borders.radius}px`,
                borderStyle: settings.style.borders.style,
                padding: `${settings.style.spacing.padding}px`,
                margin: `${settings.style.spacing.margin}px 0`,
                gap: `${settings.style.spacing.gap}px`,
                fontFamily: settings.style.typography.fontFamily,
                fontSize: `${settings.style.typography.fontSize}px`,
                fontWeight: settings.style.typography.fontWeight,
                lineHeight: settings.style.typography.lineHeight,
                color: settings.style.colors.text
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-semibold">Widget Preview</h5>
                <div 
                  className="px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: settings.style.colors.primary }}
                >
                  Primary
                </div>
              </div>
              <p className="text-sm" style={{ color: settings.style.colors.textSecondary }}>
                This is how your customized styles will appear in your widgets. 
                Adjust the settings above to see real-time changes.
              </p>
              <div className="flex space-x-2 mt-4">
                <div 
                  className="px-4 py-2 rounded text-sm font-medium text-white"
                  style={{ backgroundColor: settings.style.colors.secondary }}
                >
                  Secondary
                </div>
                <div 
                  className="px-4 py-2 rounded text-sm font-medium text-white"
                  style={{ backgroundColor: settings.style.colors.accent }}
                >
                  Accent
                </div>
              </div>
            </div>
          </div>

          {/* Style Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Style Presets</h4>
                <p className="text-sm text-gray-600">Save or load custom style configurations</p>
              </div>
              <div className="flex space-x-3">
                <Button variant="secondary" size="sm" icon="RotateCcw">
                  Reset to Default
                </Button>
                <Button variant="outline" size="sm" icon="Upload">
                  Load Preset
                </Button>
                <Button variant="primary" size="sm" icon="Save">
                  Save as Preset
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