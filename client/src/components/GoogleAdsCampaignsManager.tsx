import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Trash2, DollarSign } from "lucide-react";
import { format } from "date-fns";
import type { GoogleAdsCampaign } from "@shared/schema";

export default function GoogleAdsCampaignsManager() {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    budgetAmount: '',
    biddingStrategy: 'MAXIMIZE_CONVERSIONS',
    targetCpa: '',
    keywords: '',
    headlines: '',
    descriptions: '',
    finalUrl: '',
  });

  // Fetch all campaigns
  const { data: campaigns = [], isLoading } = useQuery<GoogleAdsCampaign[]>({
    queryKey: ["/api/google-ads/campaigns"],
  });

  // Create campaign mutation
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return apiRequest("POST", "/api/google-ads/campaigns", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/google-ads/campaigns"] });
      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
      setShowCreateForm(false);
      setFormData({
        name: '',
        budgetAmount: '',
        biddingStrategy: 'MAXIMIZE_CONVERSIONS',
        targetCpa: '',
        keywords: '',
        headlines: '',
        descriptions: '',
        finalUrl: '',
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    },
  });

  // Delete campaign mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/google-ads/campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/google-ads/campaigns"] });
      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete campaign",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const keywords = formData.keywords.split('\n').filter(k => k.trim()).map(k => ({
      text: k.trim(),
      matchType: 'BROAD' as const,
    }));

    const headlines = formData.headlines.split('\n').filter(h => h.trim()).map(h => h.trim());
    const descriptions = formData.descriptions.split('\n').filter(d => d.trim()).map(d => d.trim());

    const payload = {
      name: formData.name,
      budgetAmount: parseFloat(formData.budgetAmount),
      biddingStrategy: formData.biddingStrategy,
      targetCpa: formData.targetCpa ? parseFloat(formData.targetCpa) : undefined,
      keywords,
      headlines,
      descriptions,
      finalUrl: formData.finalUrl,
    };

    createMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground" data-testid="campaigns-title">
            Google Ads Campaigns
          </h2>
          <p className="text-muted-foreground mt-1" data-testid="campaigns-description">
            Create and manage Google Ads campaigns
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          data-testid="button-toggle-create"
        >
          <Plus className="h-4 w-4 mr-2" />
          {showCreateForm ? 'Cancel' : 'Create Campaign'}
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card data-testid="card-create-campaign">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              New Campaign
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Summer Sale Campaign"
                    required
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budgetAmount">Daily Budget ($) *</Label>
                  <Input
                    id="budgetAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.budgetAmount}
                    onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
                    placeholder="50.00"
                    required
                    data-testid="input-budget"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biddingStrategy">Bidding Strategy *</Label>
                  <Select
                    value={formData.biddingStrategy}
                    onValueChange={(value) => setFormData({ ...formData, biddingStrategy: value })}
                  >
                    <SelectTrigger id="biddingStrategy" data-testid="select-bidding">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAXIMIZE_CONVERSIONS">Maximize Conversions</SelectItem>
                      <SelectItem value="TARGET_CPA">Target CPA</SelectItem>
                      <SelectItem value="MANUAL_CPC">Manual CPC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.biddingStrategy === 'TARGET_CPA' && (
                  <div className="space-y-2">
                    <Label htmlFor="targetCpa">Target CPA ($)</Label>
                    <Input
                      id="targetCpa"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.targetCpa}
                      onChange={(e) => setFormData({ ...formData, targetCpa: e.target.value })}
                      placeholder="25.00"
                      data-testid="input-target-cpa"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="finalUrl">Landing Page URL *</Label>
                  <Input
                    id="finalUrl"
                    type="url"
                    value={formData.finalUrl}
                    onChange={(e) => setFormData({ ...formData, finalUrl: e.target.value })}
                    placeholder="https://example.com/landing-page"
                    required
                    data-testid="input-final-url"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (one per line) *</Label>
                <textarea
                  id="keywords"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="senior living&#10;assisted living&#10;memory care"
                  required
                  data-testid="input-keywords"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headlines">Headlines (3-15, one per line) *</Label>
                <textarea
                  id="headlines"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.headlines}
                  onChange={(e) => setFormData({ ...formData, headlines: e.target.value })}
                  placeholder="Quality Senior Living&#10;Trusted Care Community&#10;Schedule Your Tour Today"
                  required
                  data-testid="input-headlines"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptions">Descriptions (2-4, one per line) *</Label>
                <textarea
                  id="descriptions"
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.descriptions}
                  onChange={(e) => setFormData({ ...formData, descriptions: e.target.value })}
                  placeholder="Discover exceptional senior living with personalized care plans.&#10;Schedule a tour and see why families trust us."
                  required
                  data-testid="input-descriptions"
                />
              </div>

              <Button
                type="submit"
                disabled={createMutation.isPending}
                data-testid="button-submit-campaign"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Campaign'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Campaigns Table */}
      <Card data-testid="card-campaigns-table">
        <CardHeader>
          <CardTitle>Campaigns ({campaigns.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground" data-testid="no-campaigns">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No campaigns yet</p>
              <p className="text-sm">Create your first Google Ads campaign</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead data-testid="header-name">Name</TableHead>
                    <TableHead data-testid="header-budget">Daily Budget</TableHead>
                    <TableHead data-testid="header-strategy">Bidding Strategy</TableHead>
                    <TableHead data-testid="header-status">Status</TableHead>
                    <TableHead data-testid="header-created">Created</TableHead>
                    <TableHead data-testid="header-actions">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow key={campaign.id} data-testid={`row-campaign-${campaign.id}`}>
                      <TableCell className="font-medium" data-testid={`cell-name-${campaign.id}`}>
                        {campaign.name}
                      </TableCell>
                      <TableCell data-testid={`cell-budget-${campaign.id}`}>
                        ${(Number(campaign.budgetAmountMicros) / 1000000).toFixed(2)}
                      </TableCell>
                      <TableCell data-testid={`cell-strategy-${campaign.id}`}>
                        {campaign.biddingStrategy?.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell data-testid={`cell-status-${campaign.id}`}>
                        {campaign.status || 'ACTIVE'}
                      </TableCell>
                      <TableCell data-testid={`cell-created-${campaign.id}`}>
                        {campaign.createdAt ? (
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell data-testid={`cell-actions-${campaign.id}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(campaign.id)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-${campaign.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
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
