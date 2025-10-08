import { useQuery } from "@tanstack/react-query";
import { useScheduleTour } from "@/hooks/useScheduleTour";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TalkFurtherWidget from "@/components/TalkFurtherWidget";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { Loader2 } from "lucide-react";
import type { Community } from "@shared/schema";

export default function ScheduleTourDialog() {
  const { isOpen, options, closeScheduleTour } = useScheduleTour();

  // Fetch community details if communityId is provided
  const { data: community, isLoading } = useQuery<Community>({
    queryKey: ["/api/communities", options?.communityId],
    enabled: !!options?.communityId && isOpen,
    queryFn: async () => {
      const res = await fetch(`/api/communities/${options?.communityId}`);
      if (!res.ok) throw new Error("Failed to fetch community");
      return res.json();
    },
  });

  const title = options?.title || (community?.name ? `Schedule a Tour at ${community.name}` : "Schedule a Tour");
  const description = options?.description || "Choose your preferred date and time, and we'll be in touch to confirm your visit.";

  // Determine if we should show TalkFurther widget
  const hasTalkFurther = community?.talkFurtherId;

  return (
    <Dialog open={isOpen} onOpenChange={closeScheduleTour}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="schedule-tour-dialog">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-base">{description}</DialogDescription>
          {options?.urgencyText && (
            <p className="text-sm font-semibold text-primary mt-2">{options.urgencyText}</p>
          )}
        </DialogHeader>

        <div className="mt-4">
          {isLoading && options?.communityId ? (
            <div className="flex items-center justify-center py-12" data-testid="loading-community">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading community details...</span>
            </div>
          ) : hasTalkFurther ? (
            <TalkFurtherWidget widgetId={community!.talkFurtherId!} />
          ) : (
            <LeadCaptureForm
              communityId={options?.communityId}
              onSuccess={() => {
                closeScheduleTour();
              }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
