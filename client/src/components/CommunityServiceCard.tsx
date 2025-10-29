import { MapPin, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useResolveImageUrl } from "@/hooks/useResolveImageUrl";
import { getCityState } from "@/lib/communityContact";
import type { Community } from "@shared/schema";

interface CommunityServiceCardProps {
  community: Community;
}

export default function CommunityServiceCard({ community }: CommunityServiceCardProps) {
  const heroImageUrl = useResolveImageUrl(community.heroImageUrl || community.imageId);
  
  return (
    <Link href={`/communities/${community.slug}`}>
      <div 
        className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
        data-testid={`community-card-${community.slug}`}
      >
        {/* Image */}
        <div className="aspect-[16/9] overflow-hidden bg-gray-100">
          <img
            src={heroImageUrl || `https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450`}
            alt={`${community.name} - Senior Living Community`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            data-testid={`image-${community.slug}`}
          />
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors" data-testid={`name-${community.slug}`}>
            {community.name}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-3 flex items-center" data-testid={`location-${community.slug}`}>
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            {getCityState(community)}
          </p>
          
          {community.shortDescription && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4" data-testid={`description-${community.slug}`}>
              {community.shortDescription}
            </p>
          )}
          
          <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
            <span>View Community</span>
            <ExternalLink className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}