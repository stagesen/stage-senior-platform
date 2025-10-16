import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, DollarSign, Users, Shield } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { HomepageSection } from "@shared/schema";

const sectionFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  body: z.string().min(1, "Body text is required"),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  imageId: z.string().optional().nullable(),
  visible: z.boolean().default(true),
});

type SectionFormData = z.infer<typeof sectionFormSchema>;

interface SectionEditorProps {
  slug: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  section?: HomepageSection;
}

function SectionEditor({ slug, title, description, icon, section }: SectionEditorProps) {
  const { toast } = useToast();

  const form = useForm<SectionFormData>({
    resolver: zodResolver(sectionFormSchema),
    defaultValues: {
      title: section?.title || "",
      subtitle: section?.subtitle || "",
      body: section?.body || "",
      ctaLabel: section?.ctaLabel || "",
      ctaUrl: section?.ctaUrl || "",
      imageId: section?.imageId || null,
      visible: section?.visible ?? true,
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: SectionFormData) => {
      if (!section?.id) throw new Error("Section not found");
      return apiRequest("PUT", `/api/homepage-sections/${section.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/homepage-sections"] });
      toast({
        title: "Section updated",
        description: "The section has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update section: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SectionFormData) => {
    updateMutation.mutate(data);
  };

  if (!section) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {icon}
            </div>
            <div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Section not found in database.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter section title" data-testid={`input-${slug}-title`} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subtitle */}
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter subtitle" data-testid={`input-${slug}-subtitle`} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Body Text */}
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter main content text"
                      rows={4}
                      data-testid={`textarea-${slug}-body`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CTA Button Label */}
            <FormField
              control={form.control}
              name="ctaLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Text (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Learn More" data-testid={`input-${slug}-cta-label`} />
                  </FormControl>
                  <FormDescription>The text displayed on the call-to-action button</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CTA Button URL */}
            <FormField
              control={form.control}
              name="ctaUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Link (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="/about" data-testid={`input-${slug}-cta-url`} />
                  </FormControl>
                  <FormDescription>Where the button should link to</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Image Upload */}
            <FormField
              control={form.control}
              name="imageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Image</FormLabel>
                  <FormControl>
                    <ImageUploader
                      value={field.value || undefined}
                      onChange={(value) => field.onChange(value || null)}
                      multiple={false}
                      label="Upload section image"
                      accept="image/*"
                      showDelete={true}
                    />
                  </FormControl>
                  <FormDescription>Upload an image for this section</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Visibility Toggle */}
            <FormField
              control={form.control}
              name="visible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Visible on Homepage</FormLabel>
                    <FormDescription>
                      Show this section on the homepage
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid={`switch-${slug}-visible`}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              data-testid={`button-save-${slug}`}
            >
              {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export function HomepageHighlightsManager() {
  const { data: sections = [], isLoading } = useQuery<HomepageSection[]>({
    queryKey: ["/api/homepage-sections"],
  });

  const transparentSection = sections.find(s => s.slug === 'transparent-pricing');
  const locallyOwnedSection = sections.find(s => s.slug === 'locally-owned');
  const safetySection = sections.find(s => s.slug === 'safety-with-dignity');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Homepage Feature Sections</h2>
        <p className="text-muted-foreground">
          Manage the three main feature sections that appear on your homepage. Each section includes a title, description, button, and image.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SectionEditor
          slug="transparent-pricing"
          title="Transparent Care-Based Pricing"
          description="Section highlighting transparent pricing and Care Points system"
          icon={<DollarSign className="w-5 h-5 text-primary" />}
          section={transparentSection}
        />

        <SectionEditor
          slug="safety-with-dignity"
          title="Safety with Dignity"
          description="Section showcasing safety technology and dignity-focused care"
          icon={<Shield className="w-5 h-5 text-primary" />}
          section={safetySection}
        />

        <SectionEditor
          slug="locally-owned"
          title="Locally Owned & Operated"
          description="Section emphasizing local ownership and community focus"
          icon={<Users className="w-5 h-5 text-primary" />}
          section={locallyOwnedSection}
        />
      </div>
    </div>
  );
}
