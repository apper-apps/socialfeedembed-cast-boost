import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import templateService from "@/services/api/templateService";
import ApperIcon from "@/components/ApperIcon";
import Settings from "@/components/pages/Settings";
import Layout from "@/components/organisms/Layout";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import WidgetPreview from "@/components/molecules/WidgetPreview";
import FilterInput from "@/components/molecules/FilterInput";
import EmbedCodeModal from "@/components/molecules/EmbedCodeModal";
import PlatformSelector from "@/components/molecules/PlatformSelector";
import ThemeSelector from "@/components/molecules/ThemeSelector";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import postService from "@/services/api/postService";
import { widgetService } from "@/services/api/widgetService";

const WidgetBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditing = Boolean(id);
  const templateId = searchParams.get('template');
  
  const [widget, setWidget] = useState({
    name: "",
    platforms: [],
    filters: [],
    layout: 'grid',
    theme: 'minimal',
    maxPosts: 10,
    sortBy: 'newest'
  });
  const [posts, setPosts] = useState([]);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const layoutOptions = [
    { value: 'grid', label: 'Grid Layout' },
    { value: 'list', label: 'List Layout' },
    { value: 'masonry', label: 'Masonry Layout' }
  ];

  const themeOptions = [
    { value: 'minimal', label: 'Minimal', description: 'Clean, minimal design with lots of whitespace' },
    { value: 'card', label: 'Card', description: 'Modern card-based layout with subtle shadows' },
    { value: 'compact', label: 'Compact', description: 'Dense layout perfect for sidebars' },
    { value: 'magazine', label: 'Magazine', description: 'Rich editorial style with enhanced typography' }
  ];

  const maxPostsOptions = [
    { value: 5, label: '5 Posts' },
    { value: 10, label: '10 Posts' },
    { value: 15, label: '15 Posts' },
    { value: 20, label: '20 Posts' },
    { value: 30, label: '30 Posts' },
    { value: 50, label: '50 Posts' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'engagement', label: 'Most Engagement' }
  ];

  useEffect(() => {
    if (isEditing) {
      loadWidget();
    } else if (templateId) {
      loadTemplate();
    } else {
      // Load from URL parameters if template data is provided
      loadFromUrlParams();
    }
    loadPosts();
  }, [id, templateId]);

const loadWidget = async () => {
    try {
      setLoading(true);
      setError('');
      const widgetData = await widgetService.getById(id);
      setWidget(widgetData);
      toast.success('Widget loaded successfully');
    } catch (error) {
      setError('Failed to load widget. Please try again.');
      console.error('Error loading widget:', error);
      toast.error('Failed to load widget');
    } finally {
      setLoading(false);
    }
  };

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const templateData = await templateService.getById(templateId);
      setWidget({
        name: templateData.name,
        platforms: templateData.platforms || [],
        filters: templateData.filters || [],
        layout: templateData.layout || "grid",
        theme: templateData.theme || "minimal",
        maxPosts: templateData.maxPosts || 10,
      });
      toast.success(`Template "${templateData.name}" loaded successfully`);
    } catch (error) {
      toast.error("Failed to load template");
    } finally {
      setLoading(false);
    }
  };

  const loadFromUrlParams = () => {
    try {
      const name = searchParams.get('name');
      const platforms = searchParams.get('platforms');
      const filters = searchParams.get('filters');
      const layout = searchParams.get('layout');
      const theme = searchParams.get('theme');
      const maxPosts = searchParams.get('maxPosts');

      if (name || platforms || filters) {
        setWidget(prev => ({
          ...prev,
          ...(name && { name }),
          ...(platforms && { platforms: JSON.parse(platforms) }),
          ...(filters && { filters: JSON.parse(filters) }),
          ...(layout && { layout }),
          ...(theme && { theme }),
          ...(maxPosts && { maxPosts: parseInt(maxPosts) })
        }));
      }
    } catch (error) {
      console.error('Error loading from URL parameters:', error);
    }
  };

const loadPosts = async () => {
    try {
      const data = await postService.getAll();
      
      // Filter posts based on selected platforms and filters
      let filteredPosts = data;
      
      if (widget.platforms.length > 0) {
        filteredPosts = filteredPosts.filter(post => 
          widget.platforms.includes(post.platform)
        );
      }

      if (widget.filters.length > 0) {
        const includeFilters = widget.filters.filter(filter => !filter.mode || filter.mode === 'include');
        const excludeFilters = widget.filters.filter(filter => filter.mode === 'exclude');
        
        // Apply include filters first
        if (includeFilters.length > 0) {
          filteredPosts = filteredPosts.filter(post => {
            return includeFilters.some(filter => {
              const matchesPlatform = filter.platform === 'all' || filter.platform === post.platform;
              
              switch (filter.type) {
                case 'hashtag':
                  return matchesPlatform && post.content.toLowerCase().includes(`#${filter.value.toLowerCase()}`);
                case 'username':
                  return matchesPlatform && post.author.toLowerCase().includes(filter.value.toLowerCase());
                case 'keyword':
                  return matchesPlatform && post.content.toLowerCase().includes(filter.value.toLowerCase());
                default:
                  return false;
              }
            });
          });
        }
        
        // Apply exclude filters
        if (excludeFilters.length > 0) {
          filteredPosts = filteredPosts.filter(post => {
            return !excludeFilters.some(filter => {
              const matchesPlatform = filter.platform === 'all' || filter.platform === post.platform;
              
              switch (filter.type) {
                case 'hashtag':
                  return matchesPlatform && post.content.toLowerCase().includes(`#${filter.value.toLowerCase()}`);
                case 'username':
                  return matchesPlatform && post.author.toLowerCase().includes(filter.value.toLowerCase());
                case 'keyword':
                  return matchesPlatform && post.content.toLowerCase().includes(filter.value.toLowerCase());
                default:
                  return false;
              }
            });
          });
        }
      }

      setPosts(filteredPosts);
    } catch (err) {
      console.error('Error loading posts:', err);
    }
  };
useEffect(() => {
    if (widget.platforms.length > 0) {
      loadPosts();
    }
  }, [widget.platforms, widget.filters]);

  const handleSaveWidget = async () => {
    if (!widget.name.trim()) {
      toast.error('Please enter a widget name')
      return
    }

    if (widget.platforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    try {
      setSaving(true)
      
      if (isEditing) {
        await widgetService.update(parseInt(id), widget)
        toast.success('Widget updated successfully')
      } else {
        const newWidget = await widgetService.create(widget)
        setWidget(newWidget)
        toast.success('Widget created successfully')
        navigate(`/edit-widget/${newWidget.Id}`)
      }
    } catch (err) {
      toast.error(isEditing ? 'Failed to update widget' : 'Failed to create widget')
      console.error('Error saving widget:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleGetEmbedCode = () => {
    if (!widget.name.trim()) {
      toast.error('Please save the widget first')
      return
    }
    setShowEmbedModal(true)
  }

  if (loading) {
    return <Loading type="builder" />
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadWidget} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Widget' : 'Create Widget'}
          </h1>
          <p className="text-gray-600 mt-1">
            Configure your social media feed widget
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => navigate('/widgets')}
          >
            Cancel
          </Button>
          <Button
            variant="accent"
            icon="Code"
            onClick={handleGetEmbedCode}
            disabled={!widget.name.trim()}
          >
            Get Embed Code
          </Button>
          <Button
            variant="primary"
            icon="Save"
            onClick={handleSaveWidget}
            loading={saving}
          >
            {isEditing ? 'Update Widget' : 'Save Widget'}
          </Button>
        </div>
      </div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Platform Selection */}
          <Card>
            <PlatformSelector
              selectedPlatforms={widget.platforms}
              onPlatformChange={(platforms) => setWidget(prev => ({ ...prev, platforms }))}
            />
          </Card>

          {/* Filters */}
          <Card>
            <FilterInput
              filters={widget.filters}
              onFiltersChange={(filters) => setWidget(prev => ({ ...prev, filters }))}
              selectedPlatforms={widget.platforms}
            />
          </Card>

          {/* Basic Settings */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Settings</h3>
            <div className="space-y-4">
              <Input
                label="Widget Name"
                value={widget.name}
                onChange={(e) => setWidget(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter widget name..."
                required
              />
              
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Max Posts"
                  value={widget.maxPosts}
                  onChange={(e) => setWidget(prev => ({ ...prev, maxPosts: parseInt(e.target.value) }))}
                  options={maxPostsOptions}
                />
                
                <Select
                  label="Sort By"
                  value={widget.sortBy}
                  onChange={(e) => setWidget(prev => ({ ...prev, sortBy: e.target.value }))}
                  options={sortOptions}
                />
              </div>
            </div>
          </Card>

          {/* Theme & Layout Settings */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme & Layout</h3>
            <div className="space-y-6">
              <div>
                <Select
                  label="Layout"
                  value={widget.layout}
                  onChange={(e) => setWidget(prev => ({ ...prev, layout: e.target.value }))}
                  options={layoutOptions}
                  renderLayoutOption={(option, isSelected) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setWidget(prev => ({ ...prev, layout: option.value }))}
                      className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{option.label}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {option.value === 'grid' && 'Organized in responsive columns'}
                            {option.value === 'list' && 'Stacked vertically for easy reading'}
                            {option.value === 'masonry' && 'Dynamic heights for visual interest'}
                          </p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  )}
                  isOpen={false}
                />
              </div>

              <div>
                <ThemeSelector
                  label="Theme"
                  value={widget.theme}
                  onChange={(theme) => setWidget(prev => ({ ...prev, theme }))}
                  options={themeOptions}
                  posts={posts.slice(0, 3)}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-6">
          <WidgetPreview
            widget={widget}
            posts={posts}
            className="h-full"
          />
        </div>
      </div>

      {/* Embed Modal */}
      <EmbedCodeModal
        isOpen={showEmbedModal}
        onClose={() => setShowEmbedModal(false)}
        widget={widget}
      />
    </div>
  )
}

export default WidgetBuilder