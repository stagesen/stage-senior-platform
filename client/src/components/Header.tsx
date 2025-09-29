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
import logoUrl from "@assets/stagesenior-logo_1758726889154.webp";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
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
        { name: "Latest News", href: "/blog" },
        { name: "Contact Us", href: "/contact" },
      ]
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-lg shadow-black/5 dark:shadow-white/5" data-testid="header">
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
                className="w-auto object-contain min-w-[150px] h-10 sm:h-12 md:h-14"
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
                        <DropdownMenuContent align="start" className="min-w-[250px] p-3 bg-background/95 backdrop-blur-md border-2 shadow-xl">
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
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-get-help"
            >
              <a href="tel:+1-303-436-2300">
                <Phone className="w-4 h-4 mr-2" />
                Get Help
              </a>
            </Button>
            
            {showNavigation && (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
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
    </header>
  );
}
