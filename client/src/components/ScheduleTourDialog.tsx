import { useScheduleTour } from "@/hooks/useScheduleTour";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LeadCaptureForm from "@/components/LeadCaptureForm";

export default function ScheduleTourDialog() {
  const { isOpen, options, closeScheduleTour } = useScheduleTour();

  const title = options?.title || "Schedule a Tour";
  const description = options?.description || "Choose your preferred date and time, and we'll be in touch to confirm your visit.";

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
          <LeadCaptureForm
            communityId={options?.communityId}
            onSuccess={() => {
              closeScheduleTour();
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
