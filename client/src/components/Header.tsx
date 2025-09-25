import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, Phone } from "lucide-react";
import { useState } from "react";
import { useBookingFlow } from "@/components/booking-flow";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import logoUrl from "@assets/stagesenior-logo_1758726889154.webp";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { openBooking, trackCall } = useBookingFlow();

  const navigation = [
    { name: "Communities", href: "/communities" },
    { name: "Events", href: "/events" },
    { name: "About Us", href: "/about-us" },
  ];

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" data-testid="logo">
              <img 
                src={logoUrl} 
                alt="Stage Senior"
                className="w-auto min-w-[150px] h-10 sm:h-12 md:h-14"
              />
            </Link>
          </div>
          
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary px-3 py-2 text-xl font-bold transition-colors"
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="hidden md:inline-flex"
              onClick={() => openBooking({ source: "header-secondary" })}
              data-testid="button-book-tour"
            >
              Book a Tour
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-call"
              onClick={() => trackCall({ source: "header-call" })}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-foreground hover:text-primary px-3 py-2 text-xl font-bold transition-colors"
                      onClick={() => setIsOpen(false)}
                      data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button
                    className="mt-6"
                    onClick={() => {
                      setIsOpen(false);
                      openBooking({ source: "header-mobile" });
                    }}
                    data-testid="button-mobile-book-tour"
                  >
                    Book a Tour
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => trackCall({ source: "header-mobile-call" })}
                    data-testid="button-mobile-call"
                  >
                    Call Now
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
