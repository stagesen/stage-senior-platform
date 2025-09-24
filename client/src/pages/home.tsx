import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Phone, 
  Star, 
  Shield, 
  Heart, 
  Users, 
  Award,
  CheckCircle,
  ArrowRight,
  Mail
} from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Community, InsertTourRequest } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCareType, setSelectedCareType] = useState("all");
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    careType: "",
    message: ""
  });

  const { toast } = useToast();

  const { data: communities = [], isLoading } = useQuery<Community[]>({
    queryKey: ["/api/communities"],
  });

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch = !searchQuery || 
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCareType = selectedCareType === "all" || 
      community.careTypes?.includes(selectedCareType);

    return matchesSearch && matchesCareType;
  });

  const featuredCommunities = filteredCommunities.slice(0, 4);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("POST", "/api/tour-requests", formData);
      toast({
        title: "Request Submitted",
        description: "We'll contact you within 10 minutes to help with your needs.",
      });
      setFormData({ name: "", phone: "", email: "", careType: "", message: "" });
      setShowContactForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please call us directly.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
        <img
          src="https://images.unsplash.com/photo-1548095115-45697e521e96?q=80&w=1600&auto=format&fit=crop"
          alt="Grandparent and family enjoying the garden"
          className="absolute inset-0 h-full w-full object-cover mix-blend-overlay"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-white">
          <div className="max-w-3xl">
            <p className="uppercase tracking-widest text-white/80 text-xs mb-2" data-testid="hero-tagline">
              Locally Owned • Resident‑Focused
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight" data-testid="hero-title">
              Colorado senior living that feels like home—and performs like a pro.
            </h1>
            <p className="mt-6 text-xl text-white/90 leading-relaxed" data-testid="hero-description">
              Four Front Range communities + in‑home support. Transparent pricing, story‑first care, and a team cared for as well as they care for you.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-semibold shadow-lg px-8 py-6 text-lg"
                asChild
                data-testid="button-find-community"
              >
                <Link href="/communities">
                  <MapPin className="w-5 h-5 mr-2" />
                  Find a Community
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/60 text-white hover:bg-white/10 font-semibold px-8 py-6 text-lg"
                onClick={() => setShowContactForm(true)}
                data-testid="button-check-availability"
              >
                Check Availability
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-white/90">
              <div className="flex -space-x-2">
                <img 
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white" 
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=96&h=96&q=80&auto=format&fit=crop"
                  alt="Happy resident"
                />
                <img 
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&q=80&auto=format&fit=crop"
                  alt="Happy family"
                />
                <img 
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white" 
                  src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=96&h=96&q=80&auto=format&fit=crop"
                  alt="Staff member"
                />
              </div>
              <div className="text-lg">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.8</span>
                </div>
                <p className="text-sm opacity-90">98% resident satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Finder */}
      <section id="finder" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Find your Colorado community
            </h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search city or community..."
                  className="pl-10 w-80"
                  data-testid="input-community-search"
                />
              </div>
              <Select value={selectedCareType} onValueChange={setSelectedCareType}>
                <SelectTrigger className="w-48" data-testid="select-care-type">
                  <SelectValue placeholder="Care level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Care Types</SelectItem>
                  <SelectItem value="independent-living">Independent Living</SelectItem>
                  <SelectItem value="assisted-living">Assisted Living</SelectItem>
                  <SelectItem value="memory-care">Memory Care</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-100 animate-pulse" />
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                      <div className="h-20 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredCommunities.map((community) => (
                <Card key={community.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    {community.heroImageUrl ? (
                      <img 
                        src={community.heroImageUrl} 
                        alt={community.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2" data-testid={`community-name-${community.id}`}>
                      {community.name}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {community.city} • {community.careTypes?.join(" • ")}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {community.description}
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        asChild 
                        className="flex-1 text-sm"
                        data-testid={`button-visit-${community.id}`}
                      >
                        <Link href={`/communities/${community.slug}`}>
                          Learn More
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 text-sm"
                        onClick={() => setShowContactForm(true)}
                        data-testid={`button-pricing-${community.id}`}
                      >
                        Get Pricing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline" data-testid="button-view-all-communities">
              <Link href="/communities">
                View All Communities
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              What makes Stage Senior different
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Colorado values, personal care, and a commitment to excellence that shows in everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Transparent Care Points</h3>
                <p className="text-muted-foreground">
                  Published menu of services. Changes only when care truly changes—no nickel-and-diming.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Your Story First®</h3>
                <p className="text-muted-foreground">
                  Care plans built around personal history and family traditions, not one-size-fits-all approaches.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Staff‑First Culture</h3>
                <p className="text-muted-foreground">
                  Exceptional resident care starts with exceptional staff care. We invest in our team.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Whole‑Person Support</h3>
                <p className="text-muted-foreground">
                  Mind, body, and spirit care, including optional chaplaincy program and holistic wellness.
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">Locally Owned & Operated</h3>
                <p className="text-muted-foreground">
                  Colorado values. Long‑tenured teams. True community feel, not corporate bureaucracy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-gradient-to-br from-primary/5 to-white border-primary/20 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                    Clear pricing, no surprises
                  </h2>
                  <p className="text-xl text-muted-foreground mb-6">
                    See starting rates by community and explore our Care Points system that prevents unexpected charges. We give advance notice and partner with families on any changes.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      size="lg" 
                      onClick={() => setShowContactForm(true)}
                      data-testid="button-request-pricing"
                    >
                      Request Pricing
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      asChild
                      data-testid="button-learn-care-points"
                    >
                      <Link href="/faqs">How Care Points Work</Link>
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-primary mb-2">$3,855+</div>
                    <div className="text-sm text-muted-foreground">Starting Monthly Rate</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-primary mb-2">4</div>
                    <div className="text-sm text-muted-foreground">Colorado Communities</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-primary mb-2">98%</div>
                    <div className="text-sm text-muted-foreground">Resident Satisfaction</div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-primary mb-2">2016</div>
                    <div className="text-sm text-muted-foreground">Locally Owned Since</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Lead Generation Panel */}
      <section id="lead" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Talk to a real local advisor today
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Urgent placement? Weekend tours? We've got you. Call now or get a callback in 10 minutes.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Button 
                  size="lg" 
                  asChild
                  data-testid="button-call-now"
                >
                  <a href="tel:+1-303-555-0123">
                    <Phone className="w-5 h-5 mr-2" />
                    Call (303) 555‑0123
                  </a>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setShowContactForm(true)}
                  data-testid="button-request-callback"
                >
                  Request Callback
                </Button>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Same‑day and next‑day tours available
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Transparent availability & pricing information
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  Expert help comparing communities and care options
                </li>
              </ul>
            </div>
            
            {showContactForm ? (
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Your name *"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        placeholder="Phone number *"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        data-testid="input-contact-phone"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email (optional)"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        data-testid="input-contact-email"
                      />
                    </div>
                    <div>
                      <Select value={formData.careType} onValueChange={(value) => setFormData({...formData, careType: value})}>
                        <SelectTrigger data-testid="select-contact-care-type">
                          <SelectValue placeholder="What kind of care?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="independent-living">Independent Living</SelectItem>
                          <SelectItem value="assisted-living">Assisted Living</SelectItem>
                          <SelectItem value="memory-care">Memory Care</SelectItem>
                          <SelectItem value="in-home-care">In‑Home Care</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Textarea
                        placeholder="Tell us what you need..."
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows={3}
                        data-testid="textarea-contact-message"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button type="submit" className="flex-1" data-testid="button-submit-contact">
                        Get Help
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setShowContactForm(false)}
                        data-testid="button-cancel-contact"
                      >
                        Cancel
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      By submitting, you agree to our <Link href="#" className="underline">Privacy Policy</Link>.
                    </p>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-primary text-white">
                <CardContent className="p-8 text-center">
                  <Mail className="w-16 h-16 mx-auto mb-6 opacity-80" />
                  <h3 className="text-2xl font-bold mb-4">Get Expert Guidance</h3>
                  <p className="text-white/90 mb-6">
                    Our senior living advisors are standing by to help you find the perfect community for your loved one.
                  </p>
                  <Button 
                    size="lg" 
                    variant="secondary"
                    onClick={() => setShowContactForm(true)}
                    className="w-full"
                    data-testid="button-show-contact-form"
                  >
                    Start Your Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}