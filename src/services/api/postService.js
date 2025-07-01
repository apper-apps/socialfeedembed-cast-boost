// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
})

export const postService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "platform" } },
          { field: { Name: "author" } },
          { field: { Name: "avatar" } },
          { field: { Name: "content" } },
          { field: { Name: "media" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      }
      
      const response = await apperClient.fetchRecords('post', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error("Error fetching posts:", error)
      return []
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "platform" } },
          { field: { Name: "author" } },
          { field: { Name: "avatar" } },
          { field: { Name: "content" } },
          { field: { Name: "media" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "timestamp" } }
        ]
      }
      
      const response = await apperClient.getRecordById('post', parseInt(id), params)
      
      if (!response.success) {
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error)
      throw error
    }
  },

  async getByPlatform(platform) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "platform" } },
          { field: { Name: "author" } },
          { field: { Name: "content" } },
          { field: { Name: "likes" } },
          { field: { Name: "comments" } },
          { field: { Name: "timestamp" } }
        ],
        where: [
          {
            FieldName: "platform",
            Operator: "EqualTo",
            Values: [platform]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('post', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error(`Error fetching posts for platform ${platform}:`, error)
      return []
    }
  },

  async search(query) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "platform" } },
          { field: { Name: "author" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } }
        ],
        whereGroups: [
          {
            operator: "OR",
            subGroups: [
              {
                conditions: [
                  {
                    fieldName: "content",
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
                    fieldName: "author",
                    operator: "Contains",
                    values: [query],
                    include: true
                  }
                ],
                operator: "AND"
              }
            ]
          }
        ]
      }
      
      const response = await apperClient.fetchRecords('post', params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }
      
      return response.data || []
    } catch (error) {
      console.error(`Error searching posts for query "${query}":`, error)
      return []
    }
  }
}