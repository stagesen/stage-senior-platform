import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Users, 
  Sparkles, 
  Bath, 
  Image, 
  Calendar, 
  MessageSquare, 
  BookOpen, 
  HelpCircle, 
  MapPin 
} from "lucide-react";

interface NavigationItem {
  id: string;
  label: string;
  icon: typeof Home;
}

interface CommunityDetailNavigationProps {
  sections: {
    overview: boolean;
    features: boolean;
    amenities: boolean;
    floorPlans: boolean;
    gallery: boolean;
    events: boolean;
    testimonials: boolean;
    blogPosts: boolean;
    faqs: boolean;
    location: boolean;
  };
}

export default function CommunityDetailNavigation({ sections }: CommunityDetailNavigationProps) {
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Memoize navigationItems to prevent IntersectionObserver disconnect/observe cycles
  const navigationItems: NavigationItem[] = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'features', label: 'Features', icon: Users },
    sections.amenities && { id: 'amenities', label: 'Amenities', icon: Sparkles },
    sections.floorPlans && { id: 'floor-plans', label: 'Floor Plans', icon: Bath },
    sections.gallery && { id: 'gallery', label: 'Gallery', icon: Image },
    sections.events && { id: 'events', label: 'Events', icon: Calendar },
    sections.testimonials && { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    sections.blogPosts && { id: 'blog-posts', label: 'Blog Posts', icon: BookOpen },
    sections.faqs && { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'location', label: 'Location', icon: MapPin },
  ].filter(Boolean) as NavigationItem[], [sections]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0.1,
      }
    );

    navigationItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [navigationItems]);

  const scrollToSection = (sectionId: string) => {
    // Immediately set the active section when clicked
    setActiveSection(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      // Dynamic offset calculation based on actual header and sticky nav heights
      const header = document.querySelector('header');
      const stickyNav = document.querySelector('[data-testid="sticky-navigation"]');
      
      const headerHeight = header?.getBoundingClientRect().height || 64; // Fallback to 64px (h-16)
      const navHeight = stickyNav?.getBoundingClientRect().height || 56; // Fallback to estimated nav height
      
      const offset = headerHeight + navHeight + 20; // Add 20px buffer
      const elementPosition = element.offsetTop - offset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      className="sticky top-16 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
      data-testid="sticky-navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Community sections" className="flex overflow-x-auto py-4 space-x-1 scrollbar-hide">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => scrollToSection(item.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`
                  flex items-center space-x-2 whitespace-nowrap transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                  }
                `}
                data-testid={`community-nav-${item.id}`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}