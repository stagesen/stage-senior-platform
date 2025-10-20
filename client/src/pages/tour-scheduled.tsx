import { useEffect, useState } from 'react';
import { useLocation, useSearch } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Calendar, Phone, Mail, MapPin, ArrowRight, Download } from 'lucide-react';
import { fireLead, getMetaCookies } from '@/lib/tracking';
import type { Community } from '@shared/schema';

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
  const { data: community } = useQuery<Community>({
    queryKey: [`/api/communities/${communitySlug}`],
    enabled: !!communitySlug,
  });
  
  // Fire Tier 2 conversion (booking_confirmed) once on page load
  useEffect(() => {
    if (!tier2Fired && transactionId) {
      const metaCookies = getMetaCookies();
      
      fireLead({
        event: 'booking_confirmed',
        transactionId,
        leadType: 'booking_confirmed',
        leadValue: 100, // Tier 2 value
        community: community ? {
          id: community.id,
          name: community.name,
          slug: community.slug,
        } : undefined,
        careType: undefined,
        pageType: 'tour_scheduled',
        identifiers: {
          fbp: metaCookies.fbp,
          fbc: metaCookies.fbc,
        },
      });
      
      setTier2Fired(true);
    }
  }, [transactionId, community, tier2Fired]);
  
  // Redirect to home if no transaction ID
  if (!transactionId) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <Card className="mb-8 border-green-200 dark:border-green-800">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" data-testid="icon-success" />
            </div>
            <CardTitle className="text-2xl md:text-3xl text-green-800 dark:text-green-200" data-testid="text-success-title">
              Tour Request Received!
            </CardTitle>
            {name && (
              <p className="text-lg text-gray-600 dark:text-gray-300 mt-2" data-testid="text-success-greeting">
                Thank you, {name}!
              </p>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-700 dark:text-gray-300 text-lg" data-testid="text-success-message">
              We've received your tour request and a member of our team will be in touch with you shortly.
            </p>
          </CardContent>
        </Card>

        {/* Community Information */}
        {community && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" data-testid="text-community-name">
                <MapPin className="w-5 h-5 text-primary" />
                {community.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Location</p>
                  <p className="text-gray-600 dark:text-gray-400" data-testid="text-community-address">
                    {community.street && <>{community.street}<br /></>}
                    {community.city}, {community.state} {community.zip}
                  </p>
                </div>
              </div>
              
              {community.phoneDisplay && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Phone</p>
                    <a
                      href={`tel:${community.phoneDial || community.phoneDisplay}`}
                      className="text-primary hover:underline"
                      data-testid="link-community-phone"
                    >
                      {community.phoneDisplay}
                    </a>
                  </div>
                </div>
              )}
              
              {community.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Email</p>
                    <a
                      href={`mailto:${community.email}`}
                      className="text-primary hover:underline"
                      data-testid="link-community-email"
                    >
                      {community.email}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* What Happens Next */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle data-testid="text-next-steps-title">What Happens Next</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1 shrink-0">1</Badge>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Confirmation Call</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    A member of our team will call you within 1 business day to confirm your tour details.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1 shrink-0">2</Badge>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Schedule Your Visit</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    We'll work with you to find a convenient time for your personalized tour.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Badge variant="outline" className="mt-1 shrink-0">3</Badge>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Experience Our Community</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tour our facilities, meet our team, and see firsthand what makes our community special.
                  </p>
                </div>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Reference Number */}
        <Card className="mb-8 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Reference Number: <span className="font-mono font-medium text-gray-900 dark:text-gray-100" data-testid="text-transaction-id">{transactionId}</span>
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="gap-2"
            data-testid="button-back-home"
          >
            Back to Home
          </Button>
          
          {community && (
            <Button
              onClick={() => navigate(`/communities/${community.slug}`)}
              className="gap-2"
              data-testid="button-view-community"
            >
              View Community Details
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
