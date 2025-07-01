import settingsData from '@/services/mockData/settings.json'

let settings = { ...settingsData }

export const settingsService = {
  async getSettings() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return { ...settings }
  },

  async updateSettings(newSettings) {
    await new Promise(resolve => setTimeout(resolve, 400))
    settings = { ...settings, ...newSettings }
    return { ...settings }
  },

  async updateStyleSettings(styleSettings) {
    await new Promise(resolve => setTimeout(resolve, 350))
    settings = { 
      ...settings, 
      style: { ...settings.style, ...styleSettings }
    }
    return { ...settings }
  },

  async resetStyleSettings() {
    await new Promise(resolve => setTimeout(resolve, 300))
    settings = {
      ...settings,
      style: { ...settingsData.style }
    }
    return { ...settings }
  }
}