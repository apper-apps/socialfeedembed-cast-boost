import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
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
import { postService } from "@/services/api/postService";
import { widgetService } from "@/services/api/widgetService";
import templateService from "@/services/api/templateService";
export default function WidgetBuilder() {
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
    sortBy: 'newest',
    sliderSettings: {
      autoplay: true,
      autoplayDelay: 3000,
      speed: 300,
      dragControl: true,
      navigation: true,
      pagination: true,
      loop: true
    },
    gridSettings: {
      columns: 'auto',
      gap: 'md',
      aspectRatio: 'auto',
      hoverEffect: 'lift',
      animation: 'fadeIn',
      equalHeight: false
    },
    listSettings: {
      spacing: 'md',
      showDividers: true,
      alternateLayout: false,
      hoverEffect: 'scale',
      animation: 'slideIn',
      compactMode: false
    },
    masonrySettings: {
      columns: 'auto',
      gap: 'md',
      animation: 'stagger',
      breakInside: 'avoid',
      balanceHeight: true,
      minItemHeight: 200
    }
  });
  const [posts, setPosts] = useState([]);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

const layoutOptions = [
    { value: 'grid', label: 'Grid Layout' },
    { value: 'list', label: 'List Layout' },
    { value: 'masonry', label: 'Masonry Layout' },
    { value: 'slider', label: 'Slider Layout' }
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
                            {option.value === 'slider' && 'Horizontal scrolling carousel layout'}
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

          {/* Slider Customization Settings */}
          {widget.layout === 'slider' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Slider Settings</h3>
              <div className="space-y-6">
                {/* Autoplay Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-900">Autoplay</label>
                      <p className="text-xs text-gray-600">Automatically advance slides</p>
                    </div>
                    <Checkbox
                      checked={widget.sliderSettings.autoplay}
                      onChange={(e) => setWidget(prev => ({
                        ...prev,
                        sliderSettings: {
                          ...prev.sliderSettings,
                          autoplay: e.target.checked
                        }
                      }))}
                    />
                  </div>
                  
                  {widget.sliderSettings.autoplay && (
                    <div>
                      <Input
                        label="Autoplay Delay (ms)"
                        type="number"
                        value={widget.sliderSettings.autoplayDelay}
                        onChange={(e) => setWidget(prev => ({
                          ...prev,
                          sliderSettings: {
                            ...prev.sliderSettings,
                            autoplayDelay: parseInt(e.target.value) || 3000
                          }
                        }))}
                        min="1000"
                        max="10000"
                        step="500"
                        placeholder="3000"
                      />
                    </div>
                  )}
                </div>

                {/* Animation Speed */}
                <div>
                  <Input
                    label="Animation Speed (ms)"
                    type="number"
                    value={widget.sliderSettings.speed}
                    onChange={(e) => setWidget(prev => ({
                      ...prev,
                      sliderSettings: {
                        ...prev.sliderSettings,
                        speed: parseInt(e.target.value) || 300
                      }
                    }))}
                    min="100"
                    max="2000"
                    step="100"
                    placeholder="300"
                  />
                  <p className="text-xs text-gray-600 mt-1">How fast slides transition (lower = faster)</p>
                </div>

                {/* Control Options */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Controls</h4>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Drag to Navigate</label>
                        <p className="text-xs text-gray-600">Allow touch/mouse dragging</p>
                      </div>
                      <Checkbox
                        checked={widget.sliderSettings.dragControl}
                        onChange={(e) => setWidget(prev => ({
                          ...prev,
                          sliderSettings: {
                            ...prev.sliderSettings,
                            dragControl: e.target.checked
                          }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Navigation Arrows</label>
                        <p className="text-xs text-gray-600">Show previous/next buttons</p>
                      </div>
                      <Checkbox
                        checked={widget.sliderSettings.navigation}
                        onChange={(e) => setWidget(prev => ({
                          ...prev,
                          sliderSettings: {
                            ...prev.sliderSettings,
                            navigation: e.target.checked
                          }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Pagination Dots</label>
                        <p className="text-xs text-gray-600">Show slide indicators</p>
                      </div>
                      <Checkbox
                        checked={widget.sliderSettings.pagination}
                        onChange={(e) => setWidget(prev => ({
                          ...prev,
                          sliderSettings: {
                            ...prev.sliderSettings,
                            pagination: e.target.checked
                          }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Infinite Loop</label>
                        <p className="text-xs text-gray-600">Continuously loop through slides</p>
                      </div>
                      <Checkbox
                        checked={widget.sliderSettings.loop}
                        onChange={(e) => setWidget(prev => ({
                          ...prev,
                          sliderSettings: {
                            ...prev.sliderSettings,
                            loop: e.target.checked
                          }
                        }))}
                      />
                    </div>
                  </div>
                </div>
</div>
            </Card>
          )}

          {/* Grid Layout Customization Settings */}
          {widget.layout === 'grid' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Grid Settings</h3>
              <div className="space-y-6">
                {/* Column Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Columns</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['auto', '1', '2', '3', '4'].map((cols) => (
                        <button
                          key={cols}
                          type="button"
                          onClick={() => setWidget(prev => ({
                            ...prev,
                            gridSettings: { ...prev.gridSettings, columns: cols }
                          }))}
                          className={`p-2 text-sm border rounded-lg transition-all ${
                            widget.gridSettings.columns === cols
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {cols === 'auto' ? 'Auto' : `${cols} Col`}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Auto adjusts based on screen size</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Gap Size</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { value: 'xs', label: 'XS' },
                        { value: 'sm', label: 'SM' },
                        { value: 'md', label: 'MD' },
                        { value: 'lg', label: 'LG' },
                        { value: 'xl', label: 'XL' }
                      ].map((gap) => (
                        <button
                          key={gap.value}
                          type="button"
                          onClick={() => setWidget(prev => ({
                            ...prev,
                            gridSettings: { ...prev.gridSettings, gap: gap.value }
                          }))}
                          className={`p-2 text-sm border rounded-lg transition-all ${
                            widget.gridSettings.gap === gap.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {gap.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Aspect Ratio</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'auto', label: 'Auto' },
                        { value: 'square', label: 'Square' },
                        { value: 'video', label: '16:9' },
                        { value: 'portrait', label: '3:4' }
                      ].map((ratio) => (
                        <button
                          key={ratio.value}
                          type="button"
                          onClick={() => setWidget(prev => ({
                            ...prev,
                            gridSettings: { ...prev.gridSettings, aspectRatio: ratio.value }
                          }))}
                          className={`p-2 text-sm border rounded-lg transition-all ${
                            widget.gridSettings.aspectRatio === ratio.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {ratio.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visual Effects */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Visual Effects</h4>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Hover Effect</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'none', label: 'None' },
                        { value: 'lift', label: 'Lift' },
                        { value: 'scale', label: 'Scale' },
                        { value: 'glow', label: 'Glow' }
                      ].map((effect) => (
                        <button
                          key={effect.value}
                          type="button"
                          onClick={() => setWidget(prev => ({
                            ...prev,
                            gridSettings: { ...prev.gridSettings, hoverEffect: effect.value }
                          }))}
                          className={`p-2 text-sm border rounded-lg transition-all ${
                            widget.gridSettings.hoverEffect === effect.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {effect.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Animation</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'none', label: 'None' },
                        { value: 'fadeIn', label: 'Fade In' },
                        { value: 'slideUp', label: 'Slide Up' },
                        { value: 'stagger', label: 'Stagger' }
                      ].map((anim) => (
                        <button
                          key={anim.value}
                          type="button"
                          onClick={() => setWidget(prev => ({
                            ...prev,
                            gridSettings: { ...prev.gridSettings, animation: anim.value }
                          }))}
                          className={`p-2 text-sm border rounded-lg transition-all ${
                            widget.gridSettings.animation === anim.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {anim.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Equal Height Cards</label>
                      <p className="text-xs text-gray-600">Make all cards the same height</p>
                    </div>
                    <Checkbox
                      checked={widget.gridSettings.equalHeight}
                      onChange={(e) => setWidget(prev => ({
                        ...prev,
                        gridSettings: {
                          ...prev.gridSettings,
                          equalHeight: e.target.checked
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* List Layout Customization Settings */}
          {widget.layout === 'list' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">List Settings</h3>
              <div className="space-y-6">
                {/* Spacing Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Item Spacing</label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { value: 'xs', label: 'XS' },
                        { value: 'sm', label: 'SM' },
                        { value: 'md', label: 'MD' },
                        { value: 'lg', label: 'LG' },
                        { value: 'xl', label: 'XL' }
                      ].map((spacing) => (
                        <button
                          key={spacing.value}
                          type="button"
                          onClick={() => setWidget(prev => ({
                            ...prev,
                            listSettings: { ...prev.listSettings, spacing: spacing.value }
                          }))}
                          className={`p-2 text-sm border rounded-lg transition-all ${
                            widget.listSettings.spacing === spacing.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {spacing.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Layout Options */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Layout Options</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Show Dividers</label>
                      <p className="text-xs text-gray-600">Add lines between items</p>
                    </div>
                    <Checkbox
                      checked={widget.listSettings.showDividers}
                      onChange={(e) => setWidget(prev => ({
                        ...prev,
                        listSettings: {
                          ...prev.listSettings,
                          showDividers: e.target.checked
                        }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Alternate Layout</label>
                      <p className="text-xs text-gray-600">Alternate image position</p>
                    </div>
                    <Checkbox
                      checked={widget.listSettings.alternateLayout}
                      onChange={(e) => setWidget(prev => ({
                        ...prev,
                        listSettings: {
                          ...prev.listSettings,
                          alternateLayout: e.target.checked
                        }
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Compact Mode</label>
                      <p className="text-xs text-gray-600">Reduce spacing and padding</p>
                    </div>
                    <Checkbox
                      checked={widget.listSettings.compactMode}
                      onChange={(e) => setWidget(prev => ({
                        ...prev,
                        listSettings: {
                          ...prev.listSettings,
                          compactMode: e.target.checked
                        }
                      }))}
                    />
                  </div>
                </div>

                {/* Visual Effects */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Visual Effects</h4>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Hover Effect</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'none', label: 'None' },
                        { value: 'scale', label: 'Scale' },
                        { value: 'slide', label: 'Slide' },
                        { value: 'highlight', label: 'Highlight' }
                      ].map((effect) => (
                        <button
                          key={effect.value}
                          type="button"
                          onClick={() => setWidget(prev => ({
                            ...prev,
                            listSettings: { ...prev.listSettings, hoverEffect: effect.value }
                          }))}
                          className={`p-2 text-sm border rounded-lg transition-all ${
                            widget.listSettings.hoverEffect === effect.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {effect.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Animation</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'none', label: 'None' },
                        { value: 'slideIn', label: 'Slide In' },
                        { value: 'fadeIn', label: 'Fade In' },
                        { value: 'cascade', label: 'Cascade' }
                      ].map((anim) => (
                        <button
                          key={anim.value}
                          type="button"
                          onClick={() => setWidget(prev => ({
                            ...prev,
                            listSettings: { ...prev.listSettings, animation: anim.value }
                          }))}
                          className={`p-2 text-sm border rounded-lg transition-all ${
                            widget.listSettings.animation === anim.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {anim.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Masonry Layout Customization Settings */}
          {widget.layout === 'masonry' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Masonry Settings</h3>
              <div className="space-y-6">
                {/* Column Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Columns</label>
                    <div className="grid grid-cols-4 gap-2">
                      {['auto', '2', '3', '4', '5'].map((cols) => (
                        <button
                          key={cols}
                          type="button"
                          onClick={() => setWidget(prev => ({
                            ...prev,
                            masonrySettings: { ...prev.masonrySettings, columns: cols }
                          }))}
                          className={`p-2 text-sm border rounded-lg transition-all ${
                            widget.masonrySettings.columns === cols
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {cols === 'auto' ? 'Auto' : `${cols} Col`}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Auto adjusts based on screen size</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-2 block">Gap Size</label>
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { value: 'xs', label: 'XS' },
                        { value: 'sm', label: 'SM' },
                        { value: 'md', label: 'MD' },
                        { value: 'lg', label: 'LG' },
                        { value: 'xl', label: 'XL' }
                      ].map((gap) => (
                        <button
                          key={gap.value}
                          type="button"
                          onClick={() => setWidget(prev => ({
                            ...prev,
                            masonrySettings: { ...prev.masonrySettings, gap: gap.value }
                          }))}
                          className={`p-2 text-sm border rounded-lg transition-all ${
                            widget.masonrySettings.gap === gap.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {gap.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Input
                      label="Minimum Item Height (px)"
                      type="number"
                      value={widget.masonrySettings.minItemHeight}
                      onChange={(e) => setWidget(prev => ({
                        ...prev,
                        masonrySettings: {
                          ...prev.masonrySettings,
                          minItemHeight: parseInt(e.target.value) || 200
                        }
                      }))}
                      min="100"
                      max="500"
                      step="50"
                      placeholder="200"
                    />
                    <p className="text-xs text-gray-600 mt-1">Minimum height for masonry items</p>
                  </div>
                </div>

                {/* Layout Options */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Layout Options</h4>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Break Inside</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'auto', label: 'Auto' },
                        { value: 'avoid', label: 'Avoid' },
                        { value: 'avoid-page', label: 'Avoid Page' },
                        { value: 'avoid-column', label: 'Avoid Column' }
                      ].map((breakVal) => (
                        <button
                          key={breakVal.value}
                          type="button"
                          onClick={() => setWidget(prev => ({
                            ...prev,
                            masonrySettings: { ...prev.masonrySettings, breakInside: breakVal.value }
                          }))}
                          className={`p-2 text-sm border rounded-lg transition-all ${
                            widget.masonrySettings.breakInside === breakVal.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {breakVal.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Controls how items break across columns</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Balance Height</label>
                      <p className="text-xs text-gray-600">Try to balance column heights</p>
                    </div>
                    <Checkbox
                      checked={widget.masonrySettings.balanceHeight}
                      onChange={(e) => setWidget(prev => ({
                        ...prev,
                        masonrySettings: {
                          ...prev.masonrySettings,
                          balanceHeight: e.target.checked
                        }
                      }))}
                    />
                  </div>
                </div>

                {/* Visual Effects */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-900">Visual Effects</h4>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Animation</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'none', label: 'None' },
                        { value: 'stagger', label: 'Stagger' },
                        { value: 'cascade', label: 'Cascade' },
                        { value: 'wave', label: 'Wave' }
                      ].map((anim) => (
                        <button
                          key={anim.value}
                          type="button"
                          onClick={() => setWidget(prev => ({
                            ...prev,
                            masonrySettings: { ...prev.masonrySettings, animation: anim.value }
                          }))}
                          className={`p-2 text-sm border rounded-lg transition-all ${
                            widget.masonrySettings.animation === anim.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {anim.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
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