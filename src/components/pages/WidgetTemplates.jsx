import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import WidgetPreview from "@/components/molecules/WidgetPreview";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { postService } from "@/services/api/postService";
import templateService from "@/services/api/templateService";

function WidgetTemplates() {
  const navigate = useNavigate()
  const [templates, setTemplates] = useState([])
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'business', label: 'Business' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'community', label: 'Community' },
    { value: 'ecommerce', label: 'E-commerce' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [templatesData, postsData] = await Promise.all([
        templateService.getAll(),
        postService.getAll()
      ]);
      setTemplates(templatesData);
      setPosts(postsData);
    } catch (err) {
      setError('Failed to load templates');
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template) => {
    // Navigate to widget builder with template data
    const templateParams = new URLSearchParams({
      template: template.Id.toString(),
      name: template.name,
      platforms: JSON.stringify(template.platforms),
      filters: JSON.stringify(template.filters),
      layout: template.layout,
      theme: template.theme,
      maxPosts: template.maxPosts.toString()
    });
    
    navigate(`/create-widget?${templateParams.toString()}`);
    toast.success(`Template "${template.name}" loaded successfully`);
  };

  const getCategoryIcon = (category) => {
    const icons = {
      business: 'Building2',
      marketing: 'TrendingUp',
      community: 'Users',
      ecommerce: 'ShoppingCart'
    };
    return icons[category] || 'Layers';
  };

  const getCategoryColor = (category) => {
    const colors = {
      business: 'bg-blue-100 text-blue-800',
      marketing: 'bg-green-100 text-green-800',
      community: 'bg-purple-100 text-purple-800',
      ecommerce: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Widget Templates</h1>
          <p className="text-gray-600">
            Get started quickly with pre-built widget templates for common use cases
          </p>
        </div>
        <Button
          onClick={() => navigate('/create-widget')}
          className="lg:w-auto"
        >
          <ApperIcon name="Plus" size={20} />
          Create from Scratch
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              icon="Search"
            />
          </div>
          <div className="lg:w-48">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categories}
            />
          </div>
        </div>
      </Card>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <Card className="p-12 text-center">
          <ApperIcon name="Search" className="text-gray-400 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Templates Found</h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or category filter
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          >
            Clear Filters
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 h-full flex flex-col">
                {/* Template Info */}
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {template.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                          <ApperIcon name={getCategoryIcon(template.category)} size={12} className="inline mr-1" />
                          {template.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {template.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Globe" size={14} />
                          {template.platforms.length} platforms
                        </span>
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Filter" size={14} />
                          {template.filters.length} filters
                        </span>
                        <span className="flex items-center gap-1">
                          <ApperIcon name="Layout" size={14} />
                          {template.layout}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="flex-1 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
                    <div className="scale-75 origin-top-left transform">
                      <div style={{ width: '133.33%', height: '300px', overflow: 'hidden' }}>
                        <WidgetPreview
                          widget={{
                            ...template,
                            name: template.name
                          }}
                          posts={posts.slice(0, template.maxPosts || 6)}
                          className="shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1"
                  >
                    <ApperIcon name="Play" size={16} />
                    Use Template
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(template, null, 2));
                      toast.success('Template configuration copied to clipboard');
                    }}
                    className="px-4"
                  >
                    <ApperIcon name="Copy" size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Showing {filteredTemplates.length} of {templates.length} templates
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            {categories.slice(1).map(category => {
              const count = templates.filter(t => t.category === category.value).length;
              return (
                <span key={category.value} className="flex items-center gap-1">
                  <ApperIcon name={getCategoryIcon(category.value)} size={14} />
                  {category.label}: {count}
                </span>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WidgetTemplates;