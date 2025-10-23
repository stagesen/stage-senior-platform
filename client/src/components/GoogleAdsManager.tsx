import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleAdsConversionsManager from "./GoogleAdsConversionsManager";
import GoogleAdsCampaignsManager from "./GoogleAdsCampaignsManager";

export default function GoogleAdsManager() {
  return (
    <Tabs defaultValue="conversions" className="space-y-4">
      <TabsList data-testid="google-ads-tabs">
        <TabsTrigger value="conversions" data-testid="tab-conversions">
          Conversion Tracking
        </TabsTrigger>
        <TabsTrigger value="campaigns" data-testid="tab-campaigns">
          Campaigns
        </TabsTrigger>
      </TabsList>

      <TabsContent value="conversions" className="space-y-4">
        <GoogleAdsConversionsManager />
      </TabsContent>

      <TabsContent value="campaigns" className="space-y-4">
        <GoogleAdsCampaignsManager />
      </TabsContent>
    </Tabs>
  );
}
