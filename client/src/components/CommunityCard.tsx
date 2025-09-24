import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  Calendar, 
  Info, 
  Star, 
  Shield, 
  Leaf, 
  Users, 
  Home 
} from "lucide-react";
import type { Community } from "@shared/schema";

interface CommunityCardProps {
  community: Community;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function CommunityCard({ community, isSelected, onSelect }: CommunityCardProps) {
  const formatPrice = (price: number | null) => {
    if (!price) return "Contact for pricing";
    return `$${price.toLocaleString()}`;
  };

  const getCareTypeColor = (careType: string) => {
    switch (careType) {
      case "assisted-living":
        return "bg-primary/10 text-primary";
      case "memory-care":
        return "bg-accent/10 text-accent-foreground";
      case "independent-living":
        return "bg-secondary/10 text-secondary-foreground";
      default:
        return "bg-muted/10 text-muted-foreground";
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
                  src={community.heroImageUrl || `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600`}
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
                    variant="secondary"
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
                    4.8 (Reviews)
                  </span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground flex items-center">
                <Shield className="w-4 h-4 mr-1 text-primary" />
                Licensed & Insured
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid={`button-schedule-tour-${community.slug}`}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Tour
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                asChild
                data-testid={`button-call-${community.slug}`}
              >
                <a href={`tel:${community.phone || '+1-303-555-0123'}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                asChild
                data-testid={`button-details-${community.slug}`}
              >
                <Link href={`/communities/${community.slug}`}>
                  <Info className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
