import { useEffect, useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Phone, Mail, MapPin, ArrowRight, Home } from 'lucide-react';
import { fireScheduleTour, getMetaCookies, getClickIdsFromUrl, generateEventId } from '@/lib/tracking';
import { apiRequest } from '@/lib/queryClient';
import { useResolveImageUrl } from '@/hooks/useResolveImageUrl';
import { getPrimaryPhoneDisplay, getPrimaryPhoneHref, getCityStateZip } from '@/lib/communityContact';
import type { Community } from '@shared/schema';

interface GalleryImage {
  id: string;
  imageUrl: string;
  alt?: string;
  caption?: string;
}

interface Gallery {
  id: string;
  title: string;
  images?: GalleryImage[];
}

// Component to render a single gallery image with URL resolution
function GalleryImageItem({ image, index }: { image: GalleryImage; index: number }) {
  const resolvedUrl = useResolveImageUrl(image.imageUrl);
  
  // Show skeleton while loading
  if (resolvedUrl === null) {
    return (
      <div 
        className="aspect-square rounded-lg overflow-hidden"
        data-testid={`image-gallery-${index}`}
      >
        <Skeleton className="w-full h-full" />
      </div>
    );
  }
  
  // Don't render if URL failed to resolve
  if (!resolvedUrl) {
    return null;
  }
  
  return (
    <div 
      className="aspect-square rounded-lg overflow-hidden shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-lift)] transition-shadow duration-300"
      data-testid={`image-gallery-${index}`}
    >
      <img 
        src={resolvedUrl} 
        alt={image.alt || `Gallery image ${index + 1}`}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default function TourScheduled() {
  const searchParams = useSearch();
  const [, navigate] = useLocation();
  const [tier2Fired, setTier2Fired] = useState(false);
  
  // Parse URL parameters
  const params = new URLSearchParams(searchParams);
  const transactionId = params.get('txn') || params.get('transactionId');
  const communitySlug = params.get('community');
  const tourDate = params.get('date');
  const name = params.get('name');
  
  // Fetch community data if available
  const { data: community, isLoading: isCommunityLoading } = useQuery<Community>({
    queryKey: [`/api/communities/${communitySlug}`],
    enabled: !!communitySlug,
  });
  
  // Fetch galleries for this community
  const { data: galleries = [] } = useQuery<Gallery[]>({
    queryKey: [`/api/galleries?communityId=${community?.id}&active=true`],
    enabled: !!community?.id,
  });
  
  // Resolve hero image URL
  const heroImageUrl = useResolveImageUrl(community?.heroImageUrl);
  
  // Mutation to send conversion to server
  const conversionMutation = useMutation({
    mutationFn: async (payload: any) => {
      return apiRequest('POST', '/api/conversions', payload);
    },
    onSuccess: () => {
      console.log('[Success Page] Server-side conversion sent successfully');
    },
    onError: (error) => {
      console.error('[Success Page] Failed to send server-side conversion:', error);
    },
  });
  
  // Fire ScheduleTour conversion once on page load
  // Handles both native form (with transactionId) and TalkFurther (may not have transactionId) redirects
  useEffect(() => {
    if (!tier2Fired) {
      // If we have a community slug but community is still loading, wait
      if (communitySlug && isCommunityLoading) {
        return;
      }
      
      const metaCookies = getMetaCookies();
      const clickIds = getClickIdsFromUrl();
      
      // Use transactionId from URL if available (native form), otherwise generate one (TalkFurther)
      const eventId = transactionId || generateEventId();
      
      // Fire server-side conversion
      const conversionPayload = {
        transactionId: eventId,
        leadType: 'schedule_tour', // Changed from booking_confirmed to match form submission
        value: 250, // Changed from $100 to match ScheduleTour event value
        currency: 'USD',
        communityId: community?.id,
        communityName: community?.name || communitySlug || undefined,
        gclid: clickIds.gclid,
        gbraid: clickIds.gbraid,
        wbraid: clickIds.wbraid,
        fbclid: clickIds.fbclid,
        fbp: metaCookies.fbp,
        fbc: metaCookies.fbc,
        clientUserAgent: navigator.userAgent,
        eventSourceUrl: window.location.href,
      };
      
      // Send to server
      conversionMutation.mutate(conversionPayload);
      
      // Fire browser-side ScheduleTour event for deduplication with form submission
      // If this came from native form, same event_id ensures deduplication
      // If this came from TalkFurther, new event_id tracks the conversion
      fireScheduleTour({
        event_id: eventId,
        email: undefined, // We don't have PII on success page (privacy)
        phone: undefined,
        care_level: undefined,
        metro: undefined,
        community_name: community?.name || communitySlug || undefined,
        landing_page: window.location.pathname,
      });
      
      setTier2Fired(true);
    }
  }, [community, communitySlug, isCommunityLoading, tier2Fired, conversionMutation, transactionId]);
  
  // Allow success page to show even without transactionId (for TalkFurther redirects)
  // Conversion tracking will still fire with a generated event_id
  
  // Get up to 6 gallery images for preview
  const galleryImages = galleries.flatMap(g => g.images || []).slice(0, 6);

  return (
    <div className="min-h-screen bg-[var(--aspen-cream)] dark:bg-[var(--midnight-slate)]">
      {/* Hero Section with Community Image */}
      <div 
        className="relative h-[400px] md:h-[500px] bg-cover bg-center"
        style={{
          backgroundImage: heroImageUrl 
            ? `linear-gradient(to bottom, rgba(162, 180, 166, 0.85), rgba(45, 45, 47, 0.75)), url(${heroImageUrl})`
            : 'linear-gradient(135deg, var(--foothill-sage), var(--deep-blue))'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            {/* Success Checkmark */}
            <div className="mx-auto w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-white/90 rounded-full flex items-center justify-center mb-6 shadow-[var(--shadow-lift)]">
              <CheckCircle 
                className="w-12 h-12 md:w-16 md:h-16 text-[var(--foothill-sage)]" 
                data-testid="icon-success" 
              />
            </div>
            
            {/* Headline */}
            {isCommunityLoading && communitySlug ? (
              <Skeleton className="h-12 md:h-16 w-3/4 mx-auto mb-4 bg-white/20" />
            ) : (
              <h1 
                className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
                data-testid="text-hero-title"
              >
                Thank You for Choosing {community?.name || 'Us'}!
              </h1>
            )}
            
            {/* Personalized Subheadline */}
            {name && (
              <p 
                className="text-xl md:text-2xl text-white/95 font-light"
                data-testid="text-hero-greeting"
              >
                We're excited to welcome you, {name}!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Message Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl md:text-3xl" data-testid="text-welcome-title">
                  Your Tour Request Has Been Received
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed" data-testid="text-welcome-message">
                  Thank you for taking the first step toward finding your new home. We understand that choosing the right senior living community is an important decision, and we're honored that you're considering {community?.name || 'our community'}. A member of our caring team will reach out to you shortly to schedule your personalized tour.
                </p>
              </CardContent>
            </Card>

            {/* What to Expect Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl" data-testid="text-next-steps-title">
                  What to Expect Next
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--foothill-sage)] text-white flex items-center justify-center text-xl font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        We'll Contact You Soon
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Within 24 hours, a member of our team will reach out to confirm your tour details and answer any questions you may have.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--foothill-sage)] text-white flex items-center justify-center text-xl font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Your Personalized Tour
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        During your visit, you'll meet our dedicated team, explore our beautiful facilities, and see firsthand what makes our community special.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--stage-copper)] text-white flex items-center justify-center text-xl font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Discover Your New Home
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Experience the warmth, care, and vibrant community life that awaits you. We can't wait to show you around!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Gallery Preview */}
            {isCommunityLoading && communitySlug ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl" data-testid="text-gallery-title">
                    <Skeleton className="h-8 w-64" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, index) => (
                      <div 
                        key={index}
                        className="aspect-square rounded-lg overflow-hidden"
                        data-testid={`image-gallery-${index}`}
                      >
                        <Skeleton className="w-full h-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : galleryImages.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl" data-testid="text-gallery-title">
                    A Glimpse of {community?.name || 'Our Community'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image, index) => (
                      <GalleryImageItem key={image.id || index} image={image} index={index} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Right Column - 1/3 width, sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Card */}
              {community && (
                <Card className="border-2 border-[var(--foothill-sage)]">
                  <CardHeader>
                    <CardTitle className="text-xl" data-testid="text-contact-title">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Community Name */}
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-1" data-testid="text-community-name">
                        {community.name}
                      </h3>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-[var(--stage-copper)] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Address</p>
                        <p className="text-gray-900 dark:text-gray-100" data-testid="text-community-address">
                          {community.street && <>{community.street}<br /></>}
                          {getCityStateZip(community)}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    {community.phoneDisplay && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-[var(--stage-copper)] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                          <a
                            href={getPrimaryPhoneHref(community)}
                            className="text-[var(--deep-blue)] hover:text-[var(--bright-blue)] hover:underline font-medium"
                            data-testid="link-community-phone"
                          >
                            {getPrimaryPhoneDisplay(community)}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    {community.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-[var(--stage-copper)] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</p>
                          <a
                            href={`mailto:${community.email}`}
                            className="text-[var(--deep-blue)] hover:text-[var(--bright-blue)] hover:underline font-medium break-all"
                            data-testid="link-community-email"
                          >
                            {community.email}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Call Us Anytime CTA */}
                    {community.phoneDisplay && (
                      <div className="pt-4">
                        <Button
                          asChild
                          className="w-full"
                          size="lg"
                          data-testid="button-call-now"
                        >
                          <a href={getPrimaryPhoneHref(community)}>
                            <Phone className="w-4 h-4 mr-2" />
                            Call Us Anytime
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Reference Number */}
              <Card className="bg-[var(--mist-white)] dark:bg-[var(--pine-shadow)]">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-1">
                    Reference Number
                  </p>
                  <p className="font-mono font-semibold text-center text-gray-900 dark:text-gray-100" data-testid="text-transaction-id">
                    {transactionId}
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                {community && (
                  <Button
                    onClick={() => navigate(`/communities/${community.slug}`)}
                    className="w-full gap-2"
                    size="lg"
                    variant="copper"
                    data-testid="button-view-community"
                  >
                    Explore Our Community
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
                
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full gap-2"
                  size="lg"
                  data-testid="button-back-home"
                >
                  <Home className="w-4 h-4" />
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
