import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, Phone, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import logoUrl from "@/assets/stage-logo.webp";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [location] = useLocation();
  const normalizedLocation = location.split("?")[0];
  const isCommunityDetailPage = /^\/communities\/[^/]+$/.test(normalizedLocation);
  const showNavigation = !isCommunityDetailPage;

  const navigation = [
    { 
      name: "About Us", 
      href: null,
      dropdown: [
        { name: "Leadership", href: "/about-us" },
        { name: "Team", href: "/team" },
        { name: "Careers", href: "/careers" },
        { name: "Our Services", href: "/services" },
      ]
    },
    { name: "Communities", href: "/communities" },
    { 
      name: "Resources", 
      href: null,
      dropdown: [
        { name: "Care Navigator", href: "/care-navigator" },
        { name: "Resource Library", href: "/resources" },
        { name: "Latest News", href: "/blog" },
        { name: "Contact Us", href: "/contact" },
      ]
    },
  ];

  const handleFormSuccess = () => {
    setShowHelpModal(false);
  };

  return (
    <header 
      className="sticky top-0 z-50 border-b shadow-lg shadow-black/5 dark:shadow-white/5" 
      style={{
        backgroundColor: "var(--mist-white)", 
        borderBottomColor: "var(--soft-clay)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      data-testid="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="inline-flex items-center"
              aria-label="Stage Senior Living homepage"
              data-testid="logo"
            >
              <img
                src={logoUrl}
                alt="Stage Senior"
                className="w-auto object-contain min-w-[180px] h-8 sm:h-10 md:h-12"
                width="280"
                height="70"
                decoding="async"
              />
            </Link>
          </div>
          
          {showNavigation && (
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigation.map((item) => {
                  const base = location.split(/[?#]/)[0];
                  
                  if (item.dropdown) {
                    // Check if any dropdown item is active
                    const isActiveDropdown = item.dropdown.some(
                      subItem => base === subItem.href || base.startsWith(subItem.href + "/")
                    );
                    
                    return (
                      <DropdownMenu key={item.name}>
                        <DropdownMenuTrigger className={`px-3 py-2 text-xl font-bold transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none hover:scale-105 relative before:absolute before:inset-0 before:rounded-md before:transition-opacity before:duration-200 before:opacity-0 hover:before:opacity-100 before:bg-gradient-to-r before:from-primary/5 before:to-primary/10 flex items-center gap-1 ${
                          isActiveDropdown
                            ? "text-primary bg-primary/10 rounded-md"
                            : "text-foreground hover:text-primary"
                        }`}>
                          {item.name}
                          <ChevronDown className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="min-w-[250px] p-3 bg-background border-2 shadow-xl">
                          {item.dropdown.map((subItem) => {
                            const isActive = base === subItem.href || base.startsWith(subItem.href + "/");
                            return (
                              <DropdownMenuItem 
                                key={subItem.name} 
                                asChild 
                                className="px-4 py-3.5 mb-1 rounded-lg transition-all duration-200 hover:scale-[1.02] focus:scale-[1.02]"
                              >
                                <Link
                                  href={subItem.href}
                                  className={`w-full cursor-pointer text-xl font-semibold flex items-center justify-between group ${
                                    isActive 
                                      ? "text-primary" 
                                      : "text-foreground hover:text-primary"
                                  }`}
                                  data-testid={`nav-dropdown-${subItem.name.toLowerCase().replace(/\s+/g, '-')}`}
                                >
                                  <span>{subItem.name}</span>
                                  <ChevronRight className={`w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ${
                                    isActive ? "opacity-100 translate-x-0" : ""
                                  }`} />
                                </Link>
                              </DropdownMenuItem>
                            );
                          })}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  }
                  
                  const isActive = base === item.href || base.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`px-3 py-2 text-xl font-bold transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none hover:scale-105 relative before:absolute before:inset-0 before:rounded-md before:transition-opacity before:duration-200 before:opacity-0 hover:before:opacity-100 before:bg-gradient-to-r before:from-primary/5 before:to-primary/10 ${
                        isActive
                          ? "text-primary bg-primary/10 rounded-md"
                          : "text-foreground hover:text-primary"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                      data-testid={`nav-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}
          
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setShowHelpModal(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-get-help"
              aria-label="Get Help"
            >
              <Phone className="w-4 h-4 sm:mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Get Help</span>
            </Button>
            
            {showNavigation && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden min-h-[44px] min-w-[44px]" 
                    data-testid="button-menu"
                    aria-label="Open navigation menu"
                    aria-expanded={isOpen}
                  >
                    <Menu className="h-6 w-6" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85vw] max-w-[300px] sm:w-[300px]">
                  <nav className="flex flex-col space-y-4 mt-8">
                    {navigation.map((item) => {
                      const base = location.split(/[?#]/)[0];
                      
                      if (item.dropdown) {
                        return (
                          <div key={item.name} className="space-y-2">
                            <div className="px-3 py-2 text-xl font-bold text-foreground">
                              {item.name}
                            </div>
                            <div className="pl-4 space-y-2">
                              {item.dropdown.map((subItem) => {
                                const isActive = base === subItem.href || base.startsWith(subItem.href + "/");
                                return (
                                  <Link
                                    key={subItem.name}
                                    href={subItem.href}
                                    className={`block px-3 py-2 text-lg transition-all duration-200 ${
                                      isActive
                                        ? "text-primary bg-primary/10 rounded-md"
                                        : "text-foreground hover:text-primary"
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                  >
                                    {subItem.name}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }
                      
                      const isActive = base === item.href || base.startsWith(item.href + "/");
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`px-3 py-2 text-xl font-bold transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none hover:scale-105 relative before:absolute before:inset-0 before:rounded-md before:transition-opacity before:duration-200 before:opacity-0 hover:before:opacity-100 before:bg-gradient-to-r before:from-primary/5 before:to-primary/10 ${
                            isActive
                              ? "text-primary bg-primary/10 rounded-md"
                              : "text-foreground hover:text-primary"
                          }`}
                          aria-current={isActive ? "page" : undefined}
                          onClick={() => setIsOpen(false)}
                          data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                        >
                          {item.name}
                        </Link>
                      );
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>

      {/* Get Help Modal */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Get Your Free Consultation</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Call button */}
            <div className="flex justify-center">
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-modal-call"
              >
                <a href="tel:+1-970-444-4689">
                  <Phone className="w-5 h-5 mr-2" />
                  Call (970) 444-4689
                </a>
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or fill out the form below</span>
              </div>
            </div>

            {/* Lead Capture Form */}
            <LeadCaptureForm
              variant="modal"
              title="Request a Callback"
              description="Talk to a local senior living advisor about your needs and timeline"
              onSuccess={handleFormSuccess}
              showSocialProof={false}
            />
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
