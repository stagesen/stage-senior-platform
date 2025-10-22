import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RefreshCw, Copy, Target, Check } from "lucide-react";
import { format } from "date-fns";
import type { SelectGoogleAdsConversionAction, InsertGoogleAdsConversionAction } from "@shared/schema";

// Pre-configured conversion templates
const CONVERSION_TEMPLATES = [
  { name: 'Schedule Tour', value: 250, isPrimary: true, category: 'LEAD' as const },
  { name: 'Generate Lead', value: 25, isPrimary: false, category: 'LEAD' as const },
  { name: 'Pricing Request', value: 25, isPrimary: false, category: 'LEAD' as const },
  { name: 'Phone Call Start', value: 25, isPrimary: true, category: 'LEAD' as const },
];

export default function GoogleAdsConversionsManager() {
  const { toast } = useToast();
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);

  // Fetch all conversion actions from database
  const { data: conversions = [], isLoading } = useQuery<SelectGoogleAdsConversionAction[]>({
    queryKey: ["/api/google-ads/conversions"],
  });

  // Sync conversions from Google Ads API
  const syncMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/google-ads/conversions/sync");
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/google-ads/conversions"] });
      toast({
        title: "Sync Complete",
        description: `Synced ${data.syncedCount || 0} new and updated ${data.updatedCount || 0} existing conversion actions.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync conversion actions from Google Ads",
        variant: "destructive",
      });
    },
  });

  // Create new conversion action
  const createMutation = useMutation({
    mutationFn: async (template: typeof CONVERSION_TEMPLATES[0]) => {
      const payload: Partial<InsertGoogleAdsConversionAction> = {
        name: template.name,
        category: template.category,
        value: template.value.toString(),
        isPrimary: template.isPrimary,
        attributionModel: 'DATA_DRIVEN',
      };
      return apiRequest("POST", "/api/google-ads/conversions", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/google-ads/conversions"] });
      toast({
        title: "Success",
        description: "Conversion action created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create conversion action",
        variant: "destructive",
      });
    },
  });

  // Copy conversion label to clipboard
  const copyToClipboard = async (label: string | null) => {
    if (!label) {
      toast({
        title: "No Label",
        description: "This conversion action has no label yet",
        variant: "destructive",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(label);
      setCopiedLabel(label);
      toast({
        title: "Copied!",
        description: `Conversion label "${label}" copied to clipboard`,
      });
      setTimeout(() => setCopiedLabel(null), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Sync Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="google-ads-title">
            Google Ads Conversion Tracking
          </h2>
          <p className="text-muted-foreground mt-1" data-testid="google-ads-description">
            Manage conversion actions for Google Ads campaigns
          </p>
        </div>
        <Button
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          data-testid="button-sync-conversions"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
          {syncMutation.isPending ? 'Syncing...' : 'Sync from Google Ads'}
        </Button>
      </div>

      {/* Pre-configured Templates */}
      <Card data-testid="card-conversion-templates">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Quick Create Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {CONVERSION_TEMPLATES.map((template, index) => (
              <Card key={index} className="border-2" data-testid={`template-${template.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground" data-testid={`template-name-${index}`}>
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{template.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-foreground" data-testid={`template-value-${index}`}>
                        ${template.value}
                      </span>
                      <Badge 
                        variant={template.isPrimary ? "default" : "secondary"}
                        data-testid={`template-badge-${index}`}
                      >
                        {template.isPrimary ? 'PRIMARY' : 'SECONDARY'}
                      </Badge>
                    </div>
                    <Button
                      className="w-full"
                      size="sm"
                      onClick={() => createMutation.mutate(template)}
                      disabled={createMutation.isPending}
                      data-testid={`button-create-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      Create Conversion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conversions Table */}
      <Card data-testid="card-conversions-table">
        <CardHeader>
          <CardTitle>Conversion Actions ({conversions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : conversions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="no-conversions">
              <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No conversion actions yet</p>
              <p className="text-sm">Create one using the templates above or sync from Google Ads</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead data-testid="header-name">Name</TableHead>
                    <TableHead data-testid="header-label">Conversion Label</TableHead>
                    <TableHead data-testid="header-value">Value</TableHead>
                    <TableHead data-testid="header-status">Status</TableHead>
                    <TableHead data-testid="header-primary">Is Primary</TableHead>
                    <TableHead data-testid="header-synced">Last Synced</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversions.map((conversion) => (
                    <TableRow key={conversion.id} data-testid={`row-conversion-${conversion.id}`}>
                      <TableCell className="font-medium" data-testid={`cell-name-${conversion.id}`}>
                        {conversion.name}
                      </TableCell>
                      <TableCell data-testid={`cell-label-${conversion.id}`}>
                        {conversion.conversionLabel ? (
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {conversion.conversionLabel}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => copyToClipboard(conversion.conversionLabel)}
                              data-testid={`button-copy-${conversion.id}`}
                            >
                              {copiedLabel === conversion.conversionLabel ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">No label</span>
                        )}
                      </TableCell>
                      <TableCell data-testid={`cell-value-${conversion.id}`}>
                        {conversion.value ? (
                          <span className="font-semibold">
                            ${parseFloat(conversion.value).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell data-testid={`cell-status-${conversion.id}`}>
                        <Badge 
                          variant={conversion.status === 'ENABLED' ? 'default' : 'secondary'}
                        >
                          {conversion.status || 'UNKNOWN'}
                        </Badge>
                      </TableCell>
                      <TableCell data-testid={`cell-primary-${conversion.id}`}>
                        {conversion.isPrimary ? (
                          <Badge variant="default">PRIMARY</Badge>
                        ) : (
                          <Badge variant="secondary">SECONDARY</Badge>
                        )}
                      </TableCell>
                      <TableCell data-testid={`cell-synced-${conversion.id}`}>
                        {conversion.syncedAt ? (
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(conversion.syncedAt), 'MMM d, yyyy h:mm a')}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">Never</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
