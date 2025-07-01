import { toast } from 'react-toastify'

// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const settingsService = {
  async getSettings() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "general" } },
          { field: { Name: "api" } },
          { field: { Name: "notifications" } },
          { field: { Name: "style" } }
        ],
        pagingInfo: {
          limit: 1,
          offset: 0
        }
      }
      
      const response = await apperClient.fetchRecords('setting', params)
      
      if (!response.success) {
        console.error(response.message)
        // Return default settings if none exist
        return {
          general: {
            siteName: "My Awesome Website",
            siteUrl: "https://myawesomewebsite.com",
            defaultTheme: "light",
            defaultLayout: "grid",
            maxPostsPerWidget: 50
          },
          api: {
            twitterKey: "",
            instagramKey: "",
            facebookKey: "",
            youtubeKey: "",
            linkedinKey: "",
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
              primary: "#3b82f6",
              secondary: "#8b5cf6",
              accent: "#06b6d4",
              background: "#ffffff",
              surface: "#f8fafc",
              text: "#1f2937",
              textSecondary: "#6b7280",
              border: "#e5e7eb"
            },
            typography: {
              fontFamily: "Inter",
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
              style: "solid"
            }
          }
        }
      }
      
      if (response.data && response.data.length > 0) {
        const setting = response.data[0]
        return {
          general: setting.general ? JSON.parse(setting.general) : {},
          api: setting.api ? JSON.parse(setting.api) : {},
          notifications: setting.notifications ? JSON.parse(setting.notifications) : {},
          style: setting.style ? JSON.parse(setting.style) : {}
        }
      }
      
      // Create default settings if none exist
      return await this.createDefaultSettings()
    } catch (error) {
      console.error("Error fetching settings:", error)
      throw error
    }
  },

  async createDefaultSettings() {
    try {
      const defaultSettings = {
        general: {
          siteName: "My Awesome Website",
          siteUrl: "https://myawesomewebsite.com",
          defaultTheme: "light",
          defaultLayout: "grid",
          maxPostsPerWidget: 50
        },
        api: {
          twitterKey: "",
          instagramKey: "",
          facebookKey: "",
          youtubeKey: "",
          linkedinKey: "",
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
            primary: "#3b82f6",
            secondary: "#8b5cf6",
            accent: "#06b6d4",
            background: "#ffffff",
            surface: "#f8fafc",
            text: "#1f2937",
            textSecondary: "#6b7280",
            border: "#e5e7eb"
          },
          typography: {
            fontFamily: "Inter",
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
            style: "solid"
          }
        }
      }

      const params = {
        records: [
          {
            Name: "Default Settings",
            general: JSON.stringify(defaultSettings.general),
            api: JSON.stringify(defaultSettings.api),
            notifications: JSON.stringify(defaultSettings.notifications),
            style: JSON.stringify(defaultSettings.style)
          }
        ]
      }
      
      const response = await apperClient.createRecord('setting', params)
      
      if (response.success && response.results && response.results[0].success) {
        return defaultSettings
      }
      
      return defaultSettings
    } catch (error) {
      console.error("Error creating default settings:", error)
      throw error
    }
  },

  async updateSettings(newSettings) {
    try {
      // First get the current settings to get the ID
      const currentSettings = await this.getSettings()
      
      // Fetch the actual record to get its ID
      const params = {
        fields: [{ field: { Name: "Name" } }],
        pagingInfo: { limit: 1, offset: 0 }
      }
      
      const response = await apperClient.fetchRecords('setting', params)
      
      if (!response.success || !response.data || response.data.length === 0) {
        // Create new settings if none exist
        return await this.createDefaultSettings()
      }
      
      const settingId = response.data[0].Id
      const mergedSettings = { ...currentSettings, ...newSettings }
      
      const updateParams = {
        records: [
          {
            Id: settingId,
            general: JSON.stringify(mergedSettings.general),
            api: JSON.stringify(mergedSettings.api),
            notifications: JSON.stringify(mergedSettings.notifications),
            style: JSON.stringify(mergedSettings.style)
          }
        ]
      }
      
      const updateResponse = await apperClient.updateRecord('setting', updateParams)
      
      if (!updateResponse.success) {
        console.error(updateResponse.message)
        toast.error(updateResponse.message)
        throw new Error(updateResponse.message)
      }
      
      return mergedSettings
    } catch (error) {
      console.error("Error updating settings:", error)
      throw error
    }
  },

  async updateStyleSettings(styleSettings) {
    try {
      const currentSettings = await this.getSettings()
      const updatedSettings = {
        ...currentSettings,
        style: { ...currentSettings.style, ...styleSettings }
      }
      
      return await this.updateSettings(updatedSettings)
    } catch (error) {
      console.error("Error updating style settings:", error)
      throw error
    }
  },

  async resetStyleSettings() {
    try {
      const currentSettings = await this.getSettings()
      const defaultStyle = {
        colors: {
          primary: "#3b82f6",
          secondary: "#8b5cf6",
          accent: "#06b6d4",
          background: "#ffffff",
          surface: "#f8fafc",
          text: "#1f2937",
          textSecondary: "#6b7280",
          border: "#e5e7eb"
        },
        typography: {
          fontFamily: "Inter",
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
          style: "solid"
        }
      }
      
      const updatedSettings = {
        ...currentSettings,
        style: defaultStyle
      }
      
      return await this.updateSettings(updatedSettings)
    } catch (error) {
      console.error("Error resetting style settings:", error)
      throw error
    }
  }
}