import { toast } from 'react-toastify'

// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

const templateService = {
  // Get all templates
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "platforms" } },
          { field: { Name: "filters" } },
          { field: { Name: "layout" } },
          { field: { Name: "theme" } },
          { field: { Name: "max_posts" } },
          { field: { Name: "featured" } },
          { field: { Name: "use_case" } },
          { field: { Name: "embed_code" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        orderBy: [
          {
            fieldName: "featured",
            sorttype: "DESC"
          },
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('template', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return (response.data || []).map(template => ({
        ...template,
        name: template.Name,
        platforms: template.platforms ? template.platforms.split(',') : [],
        filters: template.filters ? JSON.parse(template.filters) : [],
        maxPosts: template.max_posts || 10,
        useCase: template.use_case,
        embedCode: template.embed_code,
        createdAt: template.created_at,
        updatedAt: template.updated_at
      }))
    } catch (error) {
      console.error("Error fetching templates:", error)
      return []
    }
  },

  // Get template by ID
  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "platforms" } },
          { field: { Name: "filters" } },
          { field: { Name: "layout" } },
          { field: { Name: "theme" } },
          { field: { Name: "max_posts" } },
          { field: { Name: "featured" } },
          { field: { Name: "use_case" } },
          { field: { Name: "embed_code" } }
        ]
      }
      
      const response = await apperClient.getRecordById('template', parseInt(id), params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      const template = response.data
      return {
        ...template,
        name: template.Name,
        platforms: template.platforms ? template.platforms.split(',') : [],
        filters: template.filters ? JSON.parse(template.filters) : [],
        maxPosts: template.max_posts || 10,
        useCase: template.use_case,
        embedCode: template.embed_code
      }
    } catch (error) {
      console.error(`Error fetching template with ID ${id}:`, error)
      throw error
    }
  },

  // Get templates by category
  async getByCategory(category) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "platforms" } },
          { field: { Name: "layout" } },
          { field: { Name: "theme" } },
          { field: { Name: "featured" } }
        ],
        where: [
          {
            FieldName: "category",
            Operator: "EqualTo",
            Values: [category]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('template', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return (response.data || []).map(template => ({
        ...template,
        name: template.Name,
        platforms: template.platforms ? template.platforms.split(',') : []
      }))
    } catch (error) {
      console.error(`Error fetching templates for category ${category}:`, error)
      return []
    }
  },

  // Search templates
  async search(query) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "platforms" } },
          { field: { Name: "layout" } },
          { field: { Name: "theme" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "Name",
                    operator: "Contains",
                    values: [query],
                    include: true
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "description",
                    operator: "Contains",
                    values: [query],
                    include: true
                  }
                ],
                operator: "OR"
              },
              {
                conditions: [
                  {
                    fieldName: "category",
                    operator: "Contains",
                    values: [query],
                    include: true
                  }
                ],
                operator: "OR"
              }
            ]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('template', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return (response.data || []).map(template => ({
        ...template,
        name: template.Name,
        platforms: template.platforms ? template.platforms.split(',') : []
      }))
    } catch (error) {
      console.error(`Error searching templates for query "${query}":`, error)
      return []
    }
  },

  // Get featured templates
  async getFeatured() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "description" } },
          { field: { Name: "category" } },
          { field: { Name: "platforms" } },
          { field: { Name: "layout" } },
          { field: { Name: "theme" } },
          { field: { Name: "featured" } }
        ],
        where: [
          {
            FieldName: "featured",
            Operator: "EqualTo",
            Values: [true]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('template', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return (response.data || []).map(template => ({
        ...template,
        name: template.Name,
        platforms: template.platforms ? template.platforms.split(',') : []
      }))
    } catch (error) {
      console.error("Error fetching featured templates:", error)
      return []
    }
  },

  // Create new template (for admin use)
  async create(templateData) {
    try {
      const params = {
        records: [
          {
            Name: templateData.name,
            description: templateData.description || '',
            category: templateData.category,
            platforms: Array.isArray(templateData.platforms) ? templateData.platforms.join(',') : '',
            filters: JSON.stringify(templateData.filters || []),
            layout: templateData.layout || 'grid',
            theme: templateData.theme || 'minimal',
            max_posts: templateData.maxPosts || 10,
            featured: templateData.featured || false,
            use_case: templateData.useCase || '',
            embed_code: templateData.embedCode || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      }
      
      const response = await apperClient.createRecord('template', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results && response.results[0].success) {
        const newTemplate = response.results[0].data
        return {
          ...newTemplate,
          name: newTemplate.Name,
          platforms: newTemplate.platforms ? newTemplate.platforms.split(',') : [],
          maxPosts: newTemplate.max_posts
        }
      }
      
      throw new Error('Failed to create template')
    } catch (error) {
      console.error("Error creating template:", error)
      throw error
    }
  },

  // Update template (for admin use)
  async update(id, templateData) {
    try {
      const updateData = {
        Id: parseInt(id),
        updated_at: new Date().toISOString()
      }
      
      // Only include fields that are being updated
      if (templateData.name !== undefined) updateData.Name = templateData.name
      if (templateData.description !== undefined) updateData.description = templateData.description
      if (templateData.category !== undefined) updateData.category = templateData.category
      if (templateData.platforms !== undefined) updateData.platforms = Array.isArray(templateData.platforms) ? templateData.platforms.join(',') : templateData.platforms
      if (templateData.filters !== undefined) updateData.filters = JSON.stringify(templateData.filters)
      if (templateData.layout !== undefined) updateData.layout = templateData.layout
      if (templateData.theme !== undefined) updateData.theme = templateData.theme
      if (templateData.maxPosts !== undefined) updateData.max_posts = templateData.maxPosts
      if (templateData.featured !== undefined) updateData.featured = templateData.featured
      if (templateData.useCase !== undefined) updateData.use_case = templateData.useCase
      if (templateData.embedCode !== undefined) updateData.embed_code = templateData.embedCode
      
      const params = {
        records: [updateData]
      }
      
      const response = await apperClient.updateRecord('template', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results && response.results[0].success) {
        const updatedTemplate = response.results[0].data
        return {
          ...updatedTemplate,
          name: updatedTemplate.Name,
          platforms: updatedTemplate.platforms ? updatedTemplate.platforms.split(',') : [],
          maxPosts: updatedTemplate.max_posts
        }
      }
      
      throw new Error('Failed to update template')
    } catch (error) {
      console.error("Error updating template:", error)
      throw error
    }
  },

  // Delete template (for admin use)
  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      }
      
      const response = await apperClient.deleteRecord('template', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      return response.results && response.results[0].success
    } catch (error) {
      console.error("Error deleting template:", error)
      throw error
    }
  },

  // Get template statistics
  async getStats() {
    try {
      const templates = await this.getAll()
      
      const stats = {
        total: templates.length,
        byCategory: {},
        byLayout: {},
        byTheme: {}
      }
      
      templates.forEach(template => {
        // Category stats
        stats.byCategory[template.category] = (stats.byCategory[template.category] || 0) + 1
        
        // Layout stats
        stats.byLayout[template.layout] = (stats.byLayout[template.layout] || 0) + 1
        
        // Theme stats
        stats.byTheme[template.theme] = (stats.byTheme[template.theme] || 0) + 1
      })
      
      return stats
    } catch (error) {
      console.error("Error fetching template statistics:", error)
      return {
        total: 0,
        byCategory: {},
        byLayout: {},
        byTheme: {}
      }
    }
  }
}

export default templateService