import { createContext, useContext, useState, ReactNode } from "react";

interface ScheduleTourOptions {
  communityId?: string;
  communityName?: string;
  title?: string;
  description?: string;
  urgencyText?: string;
}

interface ScheduleTourContextType {
  isOpen: boolean;
  options: ScheduleTourOptions | null;
  openScheduleTour: (options?: ScheduleTourOptions) => void;
  closeScheduleTour: () => void;
}

const ScheduleTourContext = createContext<ScheduleTourContextType | undefined>(undefined);

export function ScheduleTourProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ScheduleTourOptions | null>(null);

  const openScheduleTour = (newOptions?: ScheduleTourOptions) => {
    setOptions(newOptions || null);
    setIsOpen(true);
  };

  const closeScheduleTour = () => {
    setIsOpen(false);
    // Clear options after animation completes
    setTimeout(() => setOptions(null), 300);
  };

  return (
    <ScheduleTourContext.Provider
      value={{
        isOpen,
        options,
        openScheduleTour,
        closeScheduleTour,
      }}
    >
      {children}
    </ScheduleTourContext.Provider>
  );
}

export function useScheduleTour() {
  const context = useContext(ScheduleTourContext);
  if (context === undefined) {
    throw new Error("useScheduleTour must be used within a ScheduleTourProvider");
  }
  return context;
}
