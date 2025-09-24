import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import logoUrl from "@assets/stagesenior-logo_1758726889154.webp";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: "Communities", href: "/communities" },
    { name: "Care Points", href: "/care-points" },
    { name: "Services", href: "/services" },
    { name: "Events", href: "/events" },
    { name: "Blog", href: "/blog" },
    { name: "About Us", href: "/about-us" },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled 
          ? 'bg-card/95 backdrop-blur-md border-b border-border shadow-lg shadow-black/5 dark:shadow-white/5'
          : 'bg-card border-b border-border'
      }`} data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ease-in-out ${
            isScrolled ? 'h-14' : 'h-16'
          }`}>
          <div className="flex items-center">
            <Link href="/" data-testid="logo">
              <img 
                src={logoUrl} 
                alt="Stage Senior"
                className={`w-auto min-w-[150px] transition-all duration-300 ease-in-out ${
                  isScrolled 
                    ? 'h-8 sm:h-9 md:h-10' 
                    : 'h-10 sm:h-12 md:h-14'
                }`}
              />
            </Link>
          </div>
          
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => {
                // Robust route matching logic
                const base = location.split(/[?#]/)[0];
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
          
          <div className="flex items-center space-x-4">
            <Button
              asChild
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid="button-call"
            >
              <a href="tel:+1-303-436-2300">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => {
                    // Robust route matching logic
                    const base = location.split(/[?#]/)[0];
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
          </div>
        </div>
      </div>
    </header>
  );
}
