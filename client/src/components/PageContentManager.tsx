import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUploader from "@/components/ImageUploader";
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  GripVertical,
  Eye,
  Copy,
} from "lucide-react";
import type { PageContentSection, InsertPageContentSection } from "@shared/schema";
import {
  AVAILABLE_PAGES,
  getAllSectionTypes,
  getSectionTypeMetadata,
  parseContent,
  textBlockContentSchema,
  benefitCardsContentSchema,
  featureListContentSchema,
  seasonalCardsContentSchema,
  featureGridContentSchema,
  sectionHeaderContentSchema,
  ctaContentSchema,
  heroSectionContentSchema,
} from "@/lib/pageContentSections";

interface LandingPageTemplate {
  id: string;
  title: string;
  urlPattern: string;
  active: boolean;
}

export default function PageContentManager() {
  const [selectedPagePath, setSelectedPagePath] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<PageContentSection | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showInactive, setShowInactive] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all page content sections
  const { data: allSections = [] } = useQuery<PageContentSection[]>({
    queryKey: ["/api/page-content"],
  });

  // Fetch all active landing page templates
  const { data: landingPageTemplates = [] } = useQuery<LandingPageTemplate[]>({
    queryKey: ["/api/landing-page-templates"],
    select: (data: any[]) => data.filter(template => template.active).map(t => ({
      id: t.id,
      title: t.title,
      urlPattern: t.urlPattern,
      active: t.active
    })),
  });

  // Get page counts for static pages
  const pageCounts = AVAILABLE_PAGES.map(page => ({
    ...page,
    count: allSections.filter(s => s.pagePath === page.path).length,
  }));

  // Get template counts for landing page templates
  const templateCounts = landingPageTemplates.map(template => ({
    ...template,
    count: allSections.filter(s => s.landingPageTemplateId === template.id).length,
  }));

  // Get sections for selected page or template
  const pageSections = selectedPagePath 
    ? allSections
        .filter(s => s.pagePath === selectedPagePath)
        .filter(s => showInactive || s.active)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    : selectedTemplateId
    ? allSections
        .filter(s => s.landingPageTemplateId === selectedTemplateId)
        .filter(s => showInactive || s.active)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    : [];

  const selectedPage = AVAILABLE_PAGES.find(p => p.path === selectedPagePath);
  const selectedTemplate = landingPageTemplates.find(t => t.id === selectedTemplateId);
  
  // Count active and inactive sections
  const activeSectionCount = selectedPagePath 
    ? allSections.filter(s => s.pagePath === selectedPagePath && s.active).length
    : selectedTemplateId
    ? allSections.filter(s => s.landingPageTemplateId === selectedTemplateId && s.active).length
    : 0;
  const inactiveSectionCount = selectedPagePath 
    ? allSections.filter(s => s.pagePath === selectedPagePath && !s.active).length
    : selectedTemplateId
    ? allSections.filter(s => s.landingPageTemplateId === selectedTemplateId && !s.active).length
    : 0;

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: InsertPageContentSection) => {
      return await apiRequest("POST", "/api/page-content", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/page-content"] });
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Content section created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create content section.",
        variant: "destructive",
      });
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertPageContentSection> }) => {
      return await apiRequest("PUT", `/api/page-content/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/page-content"] });
      setIsDialogOpen(false);
      setEditingSection(null);
      toast({
        title: "Success",
        description: "Content section updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update content section.",
        variant: "destructive",
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/page-content/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/page-content"] });
      toast({
        title: "Success",
        description: "Content section deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete content section.",
        variant: "destructive",
      });
    },
  });

  // Duplicate mutation
  const duplicateMutation = useMutation({
    mutationFn: async (section: PageContentSection) => {
      const timestamp = Date.now();
      const newSection: InsertPageContentSection = {
        ...(section.pagePath && { pagePath: section.pagePath }),
        ...(section.landingPageTemplateId && { landingPageTemplateId: section.landingPageTemplateId }),
        sectionType: section.sectionType,
        sectionKey: `${section.sectionKey}_copy_${timestamp}`,
        title: `${section.title} (Copy)`,
        content: section.content || {},
        sortOrder: (section.sortOrder || 0) + 1,
        active: false, // Start duplicates as inactive
      };
      return await apiRequest("POST", "/api/page-content", newSection);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/page-content"] });
      toast({
        title: "Success",
        description: "Content section duplicated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to duplicate content section.",
        variant: "destructive",
      });
    },
  });

  const handleOpenCreate = () => {
    setEditingSection(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (section: PageContentSection) => {
    setEditingSection(section);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this content section?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleDuplicate = (section: PageContentSection) => {
    duplicateMutation.mutate(section);
  };

  const handleToggleActive = (section: PageContentSection) => {
    updateMutation.mutate({
      id: section.id,
      data: { active: !section.active },
    });
  };

  // Generate content preview for a section
  const getContentPreview = (section: PageContentSection): string => {
    const content = section.content;
    if (!content || typeof content !== 'object') return "No content";

    switch (section.sectionType) {
      case 'benefit_cards':
        const cards = content.cards || [];
        if (cards.length === 0) return "No cards added";
        if (cards.length === 1) return cards[0].title || "1 card";
        return `${cards.length} cards: ${cards[0].title || 'Untitled'}${cards[1] ? ', ' + cards[1].title : ''}...`;
      
      case 'text_block':
        const text = content.text || "";
        const strippedText = text.replace(/<[^>]*>/g, '').trim();
        if (!strippedText) return "Empty text block";
        return strippedText.length > 100 ? strippedText.substring(0, 100) + '...' : strippedText;
      
      case 'hero_section':
        return content.heading || "No heading set";
      
      case 'section_header':
        const heading = content.heading || "";
        const subheading = content.subheading || "";
        return heading + (subheading ? ` — ${subheading.substring(0, 50)}${subheading.length > 50 ? '...' : ''}` : '');
      
      case 'cta':
        const buttonText = content.buttonText || "";
        const ctaHeading = content.heading || "";
        return `"${buttonText}" → ${content.buttonLink || '#'}` + (ctaHeading ? ` — ${ctaHeading}` : '');
      
      case 'feature_list':
        const items = content.items || [];
        if (items.length === 0) return "No features added";
        return `${items.length} feature${items.length !== 1 ? 's' : ''}: ${items[0]?.title || 'Untitled'}${items[1] ? ', ' + items[1].title : ''}${items.length > 2 ? '...' : ''}`;
      
      case 'feature_grid':
        const gridItems = content.items || [];
        if (gridItems.length === 0) return "No grid items";
        return `${gridItems.length} item${gridItems.length !== 1 ? 's' : ''} in grid`;
      
      case 'seasonal_cards':
        const seasonalCards = content.cards || [];
        return `${seasonalCards.length} seasonal card${seasonalCards.length !== 1 ? 's' : ''}`;
      
      default:
        return "Content configured";
    }
  };

  // Page selection view
  if (!selectedPagePath && !selectedTemplateId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Page Content Manager</CardTitle>
          <CardDescription>Select a page or landing page template to manage its content sections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Static Pages Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              📄 Static Pages
              <Badge variant="outline" className="text-xs">{pageCounts.length} pages</Badge>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pageCounts.map((page) => (
                <Card 
                  key={page.path} 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => {
                    setSelectedPagePath(page.path);
                    setSelectedTemplateId(null);
                  }}
                  data-testid={`card-page-${page.path.replace(/\//g, '-')}`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="flex items-center gap-2">
                        <span className="text-2xl">{page.emoji}</span>
                        <span>{page.name}</span>
                      </span>
                      <Badge variant={page.count > 0 ? "default" : "secondary"}>
                        {page.count}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{page.description}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">{page.path}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Landing Page Templates Section */}
          {templateCounts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                🎯 Landing Page Templates
                <Badge variant="outline" className="text-xs">{templateCounts.length} templates</Badge>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templateCounts.map((template) => (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:border-primary transition-colors border-l-4 border-l-purple-500/50"
                    onClick={() => {
                      setSelectedTemplateId(template.id);
                      setSelectedPagePath(null);
                    }}
                    data-testid={`card-template-${template.id}`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between text-base">
                        <span className="flex items-center gap-2">
                          <span className="text-2xl">🎯</span>
                          <span>{template.title}</span>
                        </span>
                        <Badge variant={template.count > 0 ? "default" : "secondary"}>
                          {template.count}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground font-mono bg-purple-50 dark:bg-purple-950/20 px-2 py-1 rounded">
                        {template.urlPattern}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Page content management view
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedPagePath(null);
                  setSelectedTemplateId(null);
                }}
                data-testid="button-back-to-pages"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pages
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{selectedPage?.emoji || (selectedTemplate ? '🎯' : '')}</span>
                  {selectedPage?.name || selectedTemplate?.title}
                  {selectedTemplate && (
                    <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700 border-purple-200">
                      Landing Page Template
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {selectedPage?.description || (selectedTemplate ? `URL Pattern: ${selectedTemplate.urlPattern}` : '')} · {activeSectionCount} active, {inactiveSectionCount} inactive
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {inactiveSectionCount > 0 && (
                <div className="flex items-center gap-2 mr-2">
                  <Switch 
                    checked={showInactive} 
                    onCheckedChange={setShowInactive}
                    data-testid="switch-show-inactive"
                  />
                  <label className="text-sm text-muted-foreground">Show inactive</label>
                </div>
              )}
              <Button onClick={handleOpenCreate} data-testid="button-add-section">
                <Plus className="w-4 h-4 mr-2" />
                Add Section
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {pageSections.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No content sections yet.</p>
              <p className="text-sm mt-2">Click "Add Section" to create your first content block.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pageSections.map((section, index) => {
                const metadata = getSectionTypeMetadata(section.sectionType);
                const Icon = metadata?.icon;
                
                return (
                  <Card 
                    key={section.id} 
                    className={!section.active 
                      ? "border-dashed border-muted bg-muted/30" 
                      : "border-l-4 border-l-primary/50"
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-muted-foreground cursor-move">
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            {Icon && <Icon className="w-4 h-4 text-muted-foreground" />}
                            <Badge variant="outline">{metadata?.name || section.sectionType}</Badge>
                            {section.pagePath && (
                              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                {section.pagePath}
                              </Badge>
                            )}
                            {section.landingPageTemplateId && (
                              <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                                🎯 Template
                              </Badge>
                            )}
                            <span className="text-xs text-muted-foreground">Order: {section.sortOrder}</span>
                            {!section.active && (
                              <Badge variant="secondary" className="bg-muted">Inactive</Badge>
                            )}
                            {section.active && (
                              <Badge variant="default" className="bg-green-500/10 text-green-700 border-green-200">Active</Badge>
                            )}
                          </div>
                          <h4 className={`font-semibold truncate ${!section.active ? 'text-muted-foreground' : ''}`}>
                            {section.title || "Untitled Section"}
                          </h4>
                          <p className="text-sm font-medium text-foreground/80 mt-2 line-clamp-2 bg-muted/50 rounded p-2">
                            {getContentPreview(section)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleToggleActive(section)}
                            data-testid={`button-toggle-${section.id}`}
                          >
                            <Eye className={`w-4 h-4 ${section.active ? '' : 'opacity-50'}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDuplicate(section)}
                            data-testid={`button-duplicate-${section.id}`}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenEdit(section)}
                            data-testid={`button-edit-${section.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(section.id)}
                            data-testid={`button-delete-${section.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Editor Dialog */}
      <SectionEditorDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingSection(null);
        }}
        section={editingSection}
        pagePath={selectedPagePath}
        landingPageTemplateId={selectedTemplateId}
        onSave={(data) => {
          if (editingSection) {
            updateMutation.mutate({ id: editingSection.id, data });
          } else {
            createMutation.mutate(data);
          }
        }}
      />
    </>
  );
}

// Section Editor Dialog Component
function SectionEditorDialog({ 
  isOpen, 
  onClose, 
  section, 
  pagePath,
  landingPageTemplateId,
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  section: PageContentSection | null;
  pagePath: string | null;
  landingPageTemplateId: string | null;
  onSave: (data: InsertPageContentSection) => void;
}) {
  const [selectedType, setSelectedType] = useState(section?.sectionType || "text_block");
  const sectionTypes = getAllSectionTypes();

  // Update selectedType when section changes
  useEffect(() => {
    setSelectedType(section?.sectionType || "text_block");
  }, [section?.id, section?.sectionType]);

  const metadata = getSectionTypeMetadata(selectedType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {section ? "Edit" : "Create"} Content Section
          </DialogTitle>
        </DialogHeader>

        {!section && (
          <div className="mb-6">
            <label className="text-sm font-medium mb-3 block">Select Section Type</label>
            <div className="grid grid-cols-2 gap-2">
              {sectionTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.type}
                    onClick={() => setSelectedType(type.type)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      selectedType === type.type 
                        ? 'border-primary bg-primary/5' 
                        : 'hover:border-muted-foreground'
                    }`}
                    data-testid={`button-section-type-${type.type}`}
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="w-5 h-5 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{type.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{type.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <SectionForm
          sectionType={selectedType}
          section={section}
          pagePath={pagePath}
          landingPageTemplateId={landingPageTemplateId}
          onSave={onSave}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}

// Section-specific form component
function SectionForm({ 
  sectionType, 
  section, 
  pagePath,
  landingPageTemplateId,
  onSave, 
  onCancel 
}: { 
  sectionType: string;
  section: PageContentSection | null;
  pagePath: string | null;
  landingPageTemplateId: string | null;
  onSave: (data: InsertPageContentSection) => void;
  onCancel: () => void;
}) {
  const metadata = getSectionTypeMetadata(sectionType);
  // Parse content - it could be an object or need parsing from string
  const parsedContent = section 
    ? (section.content && typeof section.content === 'object' ? section.content : parseContent(section.sectionType, JSON.stringify(section.content)))
    : metadata?.defaultContent;

  const baseSchema = z.object({
    title: z.string().min(1, "Title is required"),
    sortOrder: z.number().min(0),
    active: z.boolean(),
  });

  const form = useForm({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      title: section?.title || "",
      sortOrder: section?.sortOrder || 0,
      active: section?.active ?? true,
    },
  });

  const [contentData, setContentData] = useState(parsedContent || {});
  
  // Update contentData and form when section changes
  useEffect(() => {
    const newContent = section 
      ? (section.content && typeof section.content === 'object' ? section.content : parseContent(section.sectionType, JSON.stringify(section.content)))
      : metadata?.defaultContent;
    setContentData(newContent || {});
    
    // Reset form with new section data
    form.reset({
      title: section?.title || "",
      sortOrder: section?.sortOrder || 0,
      active: section?.active ?? true,
    });
  }, [section?.id, section?.title, section?.sortOrder, section?.active, section?.content, metadata?.defaultContent, section?.sectionType, form]);

  const handleSubmit = (values: z.infer<typeof baseSchema>) => {
    // Generate sectionKey from type and timestamp if creating new
    const sectionKey = section?.sectionKey || `${sectionType}_${Date.now()}`;
    
    const data: InsertPageContentSection = {
      ...(pagePath && { pagePath }),
      ...(landingPageTemplateId && { landingPageTemplateId }),
      sectionType,
      sectionKey,
      title: values.title,
      content: contentData,
      sortOrder: values.sortOrder,
      active: values.active,
    };
    onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Section Title *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter a title for this section" data-testid="input-section-title" />
              </FormControl>
              <FormDescription>This helps you identify the section in the admin panel</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Section type specific content editors */}
        {sectionType === "text_block" && (
          <TextBlockEditor value={contentData} onChange={setContentData} />
        )}

        {sectionType === "benefit_cards" && (
          <BenefitCardsEditor value={contentData} onChange={setContentData} />
        )}

        {sectionType === "feature_list" && (
          <FeatureListEditor value={contentData} onChange={setContentData} />
        )}

        {sectionType === "section_header" && (
          <SectionHeaderEditor value={contentData} onChange={setContentData} />
        )}

        {sectionType === "cta" && (
          <CTAEditor value={contentData} onChange={setContentData} />
        )}

        {sectionType === "hero_section" && (
          <HeroSectionEditor value={contentData} onChange={setContentData} />
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    data-testid="input-sort-order"
                  />
                </FormControl>
                <FormDescription>Lower numbers appear first</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 mt-8">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-active" />
                </FormControl>
                <FormLabel>Active</FormLabel>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel">
            Cancel
          </Button>
          <Button type="submit" data-testid="button-save">
            {section ? "Update" : "Create"} Section
          </Button>
        </div>
      </form>
    </Form>
  );
}

// Content editors for each section type
function TextBlockEditor({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Content</label>
      <RichTextEditor
        value={value.text || ""}
        onChange={(text) => onChange({ ...value, text })}
      />
    </div>
  );
}

function BenefitCardsEditor({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const cards = value.cards || [];

  const addCard = () => {
    onChange({ ...value, cards: [...cards, { title: "", description: "", icon: "" }] });
  };

  const updateCard = (index: number, field: string, val: string) => {
    const newCards = [...cards];
    newCards[index] = { ...newCards[index], [field]: val };
    onChange({ ...value, cards: newCards });
  };

  const removeCard = (index: number) => {
    onChange({ ...value, cards: cards.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Benefit Cards</label>
        <Button type="button" size="sm" onClick={addCard} data-testid="button-add-card">
          <Plus className="w-4 h-4 mr-1" />
          Add Card
        </Button>
      </div>
      {cards.map((card: any, index: number) => (
        <Card key={index}>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Card {index + 1}</span>
              <Button 
                type="button" 
                size="sm" 
                variant="ghost" 
                onClick={() => removeCard(index)}
                data-testid={`button-remove-card-${index}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <Input
              value={card.title}
              onChange={(e) => updateCard(index, "title", e.target.value)}
              placeholder="Card title"
              data-testid={`input-card-title-${index}`}
            />
            <Textarea
              value={card.description}
              onChange={(e) => updateCard(index, "description", e.target.value)}
              placeholder="Card description"
              rows={3}
              data-testid={`textarea-card-description-${index}`}
            />
            <Input
              value={card.icon}
              onChange={(e) => updateCard(index, "icon", e.target.value)}
              placeholder="Icon name (optional, e.g., Heart, Star)"
              data-testid={`input-card-icon-${index}`}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function FeatureListEditor({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const items = value.items || [];

  const addItem = () => {
    onChange({ ...value, items: [...items, { title: "", description: "" }] });
  };

  const updateItem = (index: number, field: string, val: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: val };
    onChange({ ...value, items: newItems });
  };

  const removeItem = (index: number) => {
    onChange({ ...value, items: items.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Feature Items</label>
        <Button type="button" size="sm" onClick={addItem} data-testid="button-add-item">
          <Plus className="w-4 h-4 mr-1" />
          Add Item
        </Button>
      </div>
      {items.map((item: any, index: number) => (
        <Card key={index}>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Item {index + 1}</span>
              <Button 
                type="button" 
                size="sm" 
                variant="ghost" 
                onClick={() => removeItem(index)}
                data-testid={`button-remove-item-${index}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <Input
              value={item.title}
              onChange={(e) => updateItem(index, "title", e.target.value)}
              placeholder="Feature title"
              data-testid={`input-item-title-${index}`}
            />
            <Textarea
              value={item.description}
              onChange={(e) => updateItem(index, "description", e.target.value)}
              placeholder="Feature description"
              rows={2}
              data-testid={`textarea-item-description-${index}`}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function SectionHeaderEditor({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Heading *</label>
        <Input
          value={value.heading || ""}
          onChange={(e) => onChange({ ...value, heading: e.target.value })}
          placeholder="Main heading text"
          data-testid="input-heading"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Subheading (Optional)</label>
        <Textarea
          value={value.subheading || ""}
          onChange={(e) => onChange({ ...value, subheading: e.target.value })}
          placeholder="Subheading or description text"
          rows={2}
          data-testid="textarea-subheading"
        />
      </div>
    </div>
  );
}

function CTAEditor({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Heading *</label>
        <Input
          value={value.heading || ""}
          onChange={(e) => onChange({ ...value, heading: e.target.value })}
          placeholder="Call to action heading"
          data-testid="input-cta-heading"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Description (Optional)</label>
        <Textarea
          value={value.description || ""}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="Supporting text for the CTA"
          rows={2}
          data-testid="textarea-cta-description"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Button Text *</label>
          <Input
            value={value.buttonText || ""}
            onChange={(e) => onChange({ ...value, buttonText: e.target.value })}
            placeholder="e.g., Get Started"
            data-testid="input-button-text"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Button Link *</label>
          <Input
            value={value.buttonLink || ""}
            onChange={(e) => onChange({ ...value, buttonLink: e.target.value })}
            placeholder="e.g., /contact"
            data-testid="input-button-link"
          />
        </div>
      </div>
    </div>
  );
}

function HeroSectionEditor({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Heading *</label>
        <Input
          value={value.heading || ""}
          onChange={(e) => onChange({ ...value, heading: e.target.value })}
          placeholder="Hero section heading"
          data-testid="input-hero-heading"
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Description *</label>
        <Textarea
          value={value.description || ""}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="Hero section description text"
          rows={4}
          data-testid="textarea-hero-description"
        />
      </div>
      <div>
        <ImageUploader
          label="Hero Background Image *"
          value={value.imageId || ""}
          onChange={(imageId) => onChange({ ...value, imageId: imageId || "" })}
          multiple={false}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Or enter an image URL directly (for external images):
        </p>
        <Input
          value={value.imageUrl || ""}
          onChange={(e) => onChange({ ...value, imageUrl: e.target.value })}
          placeholder="https://images.unsplash.com/... (optional)"
          className="mt-1"
          data-testid="input-hero-image-url"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Button Text (Optional)</label>
          <Input
            value={value.buttonText || ""}
            onChange={(e) => onChange({ ...value, buttonText: e.target.value })}
            placeholder="e.g., Tour Our Communities"
            data-testid="input-hero-button-text"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Button Link (Optional)</label>
          <Input
            value={value.buttonLink || ""}
            onChange={(e) => onChange({ ...value, buttonLink: e.target.value })}
            placeholder="e.g., /communities"
            data-testid="input-hero-button-link"
          />
        </div>
      </div>
    </div>
  );
}
