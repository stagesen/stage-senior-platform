import { useQuery } from "@tanstack/react-query";
import type { SiteSettings } from "@shared/schema";

export function useSiteSettings() {
  const { data: siteSettings, isLoading, error } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes since settings don't change often
  });

  return {
    siteSettings,
    isLoading,
    error,
    companyPhoneDisplay: siteSettings?.companyPhoneDisplay || "(970) 444-4689",
    companyPhoneDial: siteSettings?.companyPhoneDial || "+19704444689",
    companyEmail: siteSettings?.companyEmail || "info@stagesenior.com",
    supportEmail: siteSettings?.supportEmail || "info@stagesenior.com",
  };
}
