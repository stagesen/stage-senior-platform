import { Link } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  MapPin, 
  Phone, 
  Calendar, 
  Info, 
  Star, 
  Shield, 
  Leaf, 
  Users, 
  Home,
  Check,
  ChevronRight
} from "lucide-react";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { getCommunityFurtherClass } from "@/lib/furtherWidgetUtils";
import { cn } from "@/lib/utils";
import type { Community } from "@shared/schema";

interface CommunityCardProps {
  community: Community;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function CommunityCard({ community, isSelected, onSelect }: CommunityCardProps) {
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const heroImageUrl = useResolveImageUrl(community.heroImageUrl);
  const formatPrice = (price: number | null) => {
    if (!price) return "Contact for pricing";
    return `$${price.toLocaleString()}`;
  };

  const getCareTypeColor = (careType: string) => {
    switch (careType) {
      case "assisted-living":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "memory-care":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "independent-living":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getAmenityIcon = (amenity: string) => {
    if (amenity.toLowerCase().includes("garden")) return <Leaf className="w-4 h-4" />;
    if (amenity.toLowerCase().includes("staff")) return <Users className="w-4 h-4" />;
    if (amenity.toLowerCase().includes("home")) return <Home className="w-4 h-4" />;
    return <Star className="w-4 h-4" />;
  };

  return (
    <Card 
      className={`community-card overflow-hidden hover:shadow-2xl shadow-md transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary shadow-xl' : ''
      }`} 
      data-testid={`community-card-${community.slug}`}
      onClick={onSelect}
    >
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
          {/* Image - Better aspect ratio */}
          <div className="md:col-span-2 relative">
            <Link href={`/communities/${community.slug}`}>
              <div className="aspect-[4/3] md:aspect-auto md:h-full">
                <img
                  src={heroImageUrl || `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`}
                  alt={`${community.name} - Senior Living Community`}
                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                  data-testid={`image-${community.slug}`}
                />
              </div>
            </Link>
            {community.featured && (
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground shadow-lg px-3 py-1" data-testid={`badge-featured-${community.slug}`}>
                Featured Community
              </Badge>
            )}
          </div>
          
          {/* Content - More spacing */}
          <div className="md:col-span-3 p-6 md:p-8">
            <div className="flex justify-between items-start mb-3">
              <div>
                <Link href={`/communities/${community.slug}`}>
                  <h3 className="text-xl font-bold text-foreground mb-1 hover:text-primary transition-colors cursor-pointer" data-testid={`name-${community.slug}`}>
                    {community.name}
                  </h3>
                </Link>
                <p className="text-muted-foreground flex items-center" data-testid={`location-${community.slug}`}>
                  <MapPin className="w-4 h-4 mr-1" />
                  {community.city}, {community.state}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground" data-testid={`price-${community.slug}`}>
                  {formatPrice(community.startingPrice)}
                </div>
                {community.startingPrice && (
                  <div className="text-sm text-muted-foreground">starting/month</div>
                )}
              </div>
            </div>
            
            {/* Care Types */}
            {community.careTypes && community.careTypes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {community.careTypes.map((careType) => (
                  <Badge
                    key={careType}
                    className={getCareTypeColor(careType)}
                    data-testid={`care-type-${careType}-${community.slug}`}
                  >
                    {careType.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Description */}
            {community.shortDescription && (
              <p className="text-muted-foreground mb-4" data-testid={`description-${community.slug}`}>
                {community.shortDescription}
              </p>
            )}
            
            {/* Amenities */}
            {community.amenities && community.amenities.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-muted-foreground">
                {community.amenities.slice(0, 4).map((amenity, index) => (
                  <div key={index} className="flex items-center" data-testid={`amenity-${index}-${community.slug}`}>
                    {getAmenityIcon(amenity)}
                    <span className="ml-2">{amenity}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground" data-testid={`rating-${community.slug}`}>
                    {community.rating || 4.8} ({community.reviewCount || 0} Reviews)
                  </span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Shield className="w-4 h-4 mr-1 text-primary" />
                {community.licenseStatus || 'Licensed & Insured'}
              </div>
            </div>
            
            {/* Enhanced Actions with Lead Capture */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="default"
                  className={cn(
                    "flex-1 h-11 font-semibold",
                    getCommunityFurtherClass(community.slug)
                  )}
                  onClick={() => setShowLeadCapture(true)}
                  data-testid={`button-schedule-tour-${community.slug}`}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Tour
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 h-11 font-semibold" 
                  asChild
                  data-testid={`button-call-${community.slug}`}
                >
                  <a href={`tel:${community.phoneDial || community.phone || '+19704444689'}`}>
                    <Phone className="w-4 h-4 mr-2" />
                    {community.phoneDisplay || community.phone || '(970) 444-4689'}
                  </a>
                </Button>
              </div>
              
              <Button 
                variant="secondary" 
                className="w-full h-9 text-sm bg-white hover:bg-gray-50 rounded-full shadow-sm border border-gray-200"
                asChild
                data-testid={`button-details-${community.slug}`}
              >
                <Link href={`/communities/${community.slug}`}>
                  <Info className="w-4 h-4 mr-2" />
                  View Full Details
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              
              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-2">
                {(community.sameDayTours !== false) && (
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-600" />
                    <span>Same-day tours</span>
                  </div>
                )}
                {(community.noObligation !== false) && (
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-600" />
                    <span>No obligation</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Lead Capture Modal */}
      <Dialog open={showLeadCapture} onOpenChange={setShowLeadCapture}>
        <DialogContent className="max-w-md">
          <LeadCaptureForm
            variant="modal"
            title="Schedule Your Tour"
            description={`Get a personalized tour of ${community.name}`}
            communityId={community.id}
            communityName={community.name}
            urgencyText="📞 Same-day tours available"
            onSuccess={() => setShowLeadCapture(false)}
            className="border-0 shadow-none bg-transparent"
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
