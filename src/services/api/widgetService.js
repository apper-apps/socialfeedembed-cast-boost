import { toast } from 'react-toastify'

// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const widgetService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "platforms" } },
          { field: { Name: "filters" } },
          { field: { Name: "layout" } },
          { field: { Name: "theme" } },
          { field: { Name: "max_posts" } },
          { field: { Name: "slider_settings" } },
          { field: { Name: "embed_code" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          {
            fieldName: "ModifiedOn",
            sorttype: "DESC"
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('widget', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching widgets:", error)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "platforms" } },
          { field: { Name: "filters" } },
          { field: { Name: "layout" } },
          { field: { Name: "theme" } },
          { field: { Name: "max_posts" } },
          { field: { Name: "slider_settings" } },
          { field: { Name: "embed_code" } }
        ]
      }
      
      const response = await apperClient.getRecordById('widget', parseInt(id), params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      // Parse JSON fields and map database fields to UI format
      const widget = response.data
      return {
        ...widget,
        name: widget.Name,
        platforms: widget.platforms ? widget.platforms.split(',') : [],
        filters: widget.filters ? JSON.parse(widget.filters) : [],
        maxPosts: widget.max_posts || 10,
        sliderSettings: widget.slider_settings ? JSON.parse(widget.slider_settings) : {
          autoplay: true,
          autoplayDelay: 3000,
          speed: 300,
          dragControl: true,
          navigation: true,
          pagination: true,
          loop: true
        },
        embedCode: widget.embed_code || `<iframe src="https://socialfeedembed.com/embed?id=${widget.Id}" width="100%" height="400px"></iframe>`
      }
    } catch (error) {
      console.error(`Error fetching widget with ID ${id}:`, error)
      throw error
    }
  },

  async create(widgetData) {
    try {
      const params = {
        records: [
          {
            Name: widgetData.name,
            platforms: Array.isArray(widgetData.platforms) ? widgetData.platforms.join(',') : '',
            filters: JSON.stringify(widgetData.filters || []),
            layout: widgetData.layout || 'grid',
            theme: widgetData.theme || 'light',
            max_posts: widgetData.maxPosts || 10,
            slider_settings: JSON.stringify(widgetData.sliderSettings || {}),
            embed_code: `<iframe src="https://socialfeedembed.com/embed?id=new" width="100%" height="400px"></iframe>`
          }
        ]
      }
      
      const response = await apperClient.createRecord('widget', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          const newWidget = successfulRecords[0].data
          // Update embed code with actual ID
          await this.update(newWidget.Id, {
            embed_code: `<iframe src="https://socialfeedembed.com/embed?id=${newWidget.Id}" width="100%" height="400px"></iframe>`
          })
          
          return {
            ...newWidget,
            name: newWidget.Name,
            platforms: newWidget.platforms ? newWidget.platforms.split(',') : [],
            maxPosts: newWidget.max_posts
          }
        }
      }
      
      throw new Error('Failed to create widget')
    } catch (error) {
      console.error("Error creating widget:", error)
      throw error
    }
  },

  async update(id, widgetData) {
    try {
      const updateData = {}
      
      // Only include fields that are being updated
      if (widgetData.name !== undefined) updateData.Name = widgetData.name
      if (widgetData.platforms !== undefined) updateData.platforms = Array.isArray(widgetData.platforms) ? widgetData.platforms.join(',') : widgetData.platforms
      if (widgetData.filters !== undefined) updateData.filters = JSON.stringify(widgetData.filters)
      if (widgetData.layout !== undefined) updateData.layout = widgetData.layout
      if (widgetData.theme !== undefined) updateData.theme = widgetData.theme
      if (widgetData.maxPosts !== undefined) updateData.max_posts = widgetData.maxPosts
      if (widgetData.sliderSettings !== undefined) updateData.slider_settings = JSON.stringify(widgetData.sliderSettings)
      if (widgetData.embed_code !== undefined) updateData.embed_code = widgetData.embed_code
      
      const params = {
        records: [
          {
            Id: parseInt(id),
            ...updateData
          }
        ]
      }
      
      const response = await apperClient.updateRecord('widget', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`)
          
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          const updatedWidget = successfulUpdates[0].data
          return {
            ...updatedWidget,
            name: updatedWidget.Name,
            platforms: updatedWidget.platforms ? updatedWidget.platforms.split(',') : [],
            maxPosts: updatedWidget.max_posts
          }
        }
      }
      
      throw new Error('Failed to update widget')
    } catch (error) {
      console.error("Error updating widget:", error)
      throw error
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('widget', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`)
          
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      console.error("Error deleting widget:", error)
      throw error
    }
  }
}