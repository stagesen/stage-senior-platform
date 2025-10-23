import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import ImageUploader from "@/components/ImageUploader";
import { ExitIntentPopup, useExitIntent } from "@/components/ExitIntentPopup";
import { Eye, Save, Loader2 } from "lucide-react";
import type { ExitIntentPopup as ExitIntentPopupType } from "@shared/schema";

export default function ExitIntentPopupManager() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [imageId, setImageId] = useState<string | null>(null);
  const [active, setActive] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch current configuration
  const { data: config, isLoading } = useQuery<ExitIntentPopupType>({
    queryKey: ["/api/exit-intent-popup"],
  });

  // Update form when config loads
  useEffect(() => {
    if (config) {
      setTitle(config.title);
      setMessage(config.message);
      setCtaText(config.ctaText);
      setCtaLink(config.ctaLink || "");
      setImageId(config.imageId || null);
      setActive(config.active);
    }
  }, [config]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data: Partial<ExitIntentPopupType>) => {
      return await apiRequest("/api/exit-intent-popup", {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/exit-intent-popup"] });
      toast({
        title: "Success",
        description: "Exit intent popup settings saved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    saveMutation.mutate({
      title,
      message,
      ctaText,
      ctaLink: ctaLink.trim() || undefined,
      imageId: imageId || undefined,
      active,
    });
  };

  const handleImageUpload = (uploadedImageId: string) => {
    setImageId(uploadedImageId);
  };

  const handleImageRemove = () => {
    setImageId(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exit Intent Popup Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="active-toggle" className="text-base">Active</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable the exit intent popup
              </p>
            </div>
            <Switch
              id="active-toggle"
              checked={active}
              onCheckedChange={setActive}
              data-testid="switch-active"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="popup-title" data-testid="label-title">
              Popup Title
            </Label>
            <Input
              id="popup-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Wait! Don't Miss This"
              data-testid="input-title"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="popup-message" data-testid="label-message">
              Popup Message
            </Label>
            <Textarea
              id="popup-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., Get our comprehensive Senior Living Guide absolutely free"
              rows={3}
              data-testid="textarea-message"
            />
          </div>

          {/* CTA Text */}
          <div className="space-y-2">
            <Label htmlFor="cta-text" data-testid="label-cta-text">
              CTA Button Text
            </Label>
            <Input
              id="cta-text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="e.g., Get My Free Guide"
              data-testid="input-cta-text"
            />
          </div>

          {/* CTA Link */}
          <div className="space-y-2">
            <Label htmlFor="cta-link" data-testid="label-cta-link">
              CTA Button Link (Optional)
            </Label>
            <Input
              id="cta-link"
              type="url"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="https://example.com/download"
              data-testid="input-cta-link"
            />
            <p className="text-sm text-muted-foreground">
              If provided, clicking the CTA will navigate to this URL. Otherwise, it will show a form.
            </p>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label data-testid="label-image">Popup Image (Optional)</Label>
            <ImageUploader
              currentImageId={imageId}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              acceptedFileTypes="image/*"
            />
            <p className="text-sm text-muted-foreground">
              Recommended size: 200x200px or larger
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending || !title || !message || !ctaText}
              data-testid="button-save"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              data-testid="button-preview"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Popup
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      <ExitIntentPopup
        open={showPreview}
        onOpenChange={setShowPreview}
      />
    </div>
  );
}
