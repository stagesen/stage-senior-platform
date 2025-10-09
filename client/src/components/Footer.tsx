import { useState } from "react";
import { Link } from "wouter";
import { Linkedin, Phone, Mail, MapPin, ArrowRight, Heart, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import logoWhiteUrl from "@assets/stagesenior-logo-wht_1758726884711.webp";
import ashaLogoUrl from "@assets/68af28185bce7fea2a2d6c03_ASHA_ASHA_WHITE_RGB-ezgif.com-resize_1758727665004.webp";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate newsletter subscription (replace with actual API call)
    try {
      // TODO: Replace with actual newsletter API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Successfully Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const communities = [
    { name: "The Gardens at Columbine", slug: "the-gardens-at-columbine" },
    { name: "The Gardens on Quail", slug: "the-gardens-on-quail" }, 
    { name: "Golden Pond", slug: "golden-pond" },
    { name: "Stonebridge Senior", slug: "stonebridge-senior" }
  ];

  const quickLinks = [
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about-us" },
    { name: "In-Home Care", href: "/in-home-care" },
    { name: "Care Points", href: "/care-points" },
    { name: "Stage Cares", href: "/stage-cares" },
    { name: "Professional Management Services", href: "/services/management" },
    { name: "Long-Term Care Insurance", href: "/services/long-term-care" }
  ];

  return (
    <footer className="bg-[#282e34] text-[var(--mist-white)]" data-testid="footer">
      {/* Newsletter Section - Blue Background for CTA Emphasis */}
      <div className="bg-gradient-to-br from-[var(--bright-blue)] via-[var(--deep-blue)] to-[var(--deep-blue)] py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-4">
            <Heart className="w-8 h-8 text-white/90" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-6" data-testid="newsletter-title">
            Stay Connected with Our Community
          </h2>
          <p className="text-white/95 text-lg mb-10 max-w-2xl mx-auto leading-relaxed" data-testid="newsletter-description">
            Get the latest updates on events, wellness tips, and community news delivered to your inbox.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-stretch max-w-md mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="bg-white text-[var(--midnight-slate)] border-0 flex-1 h-14 text-base shadow-lg"
              disabled={isSubmitting}
              required
              inputMode="email"
              data-testid="newsletter-input"
              aria-label="Email address for newsletter"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[var(--deep-blue)] text-white hover:bg-gradient-to-r hover:from-[var(--deep-blue)] hover:to-[var(--bright-blue)] h-14 px-10 group shadow-lg font-semibold transition-all duration-300 w-full sm:w-auto"
              data-testid="newsletter-submit"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </Button>
          </form>
          <p className="text-white/70 text-sm mt-4">
            <CheckCircle className="w-4 h-4 inline mr-1" />
            No spam, unsubscribe at any time
          </p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-gradient-to-b from-[#282e34] to-[#282e34]/98 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
            {/* Company Info */}
            <div className="lg:col-span-4">
              <div className="mb-6" data-testid="footer-logo">
                <img 
                  src={logoWhiteUrl} 
                  alt="Stage Senior"
                  className="w-auto object-contain min-w-[160px] h-14 sm:h-16 md:h-18"
                />
              </div>
              <p className="text-[var(--mist-white)]/95 mb-4 text-lg leading-relaxed" data-testid="footer-description">
                Creating vibrant communities where seniors thrive. Locally owned and resident-focused since 2016.
              </p>
              
              {/* LinkedIn */}
              <div className="mb-8">
                <a
                  href="https://linkedin.com/company/stage-management-llc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex bg-gradient-to-br from-background/15 to-background/10 hover:from-primary hover:to-primary/90 text-background/70 hover:text-background p-3.5 rounded-xl transition-all duration-300 group border border-background/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/20"
                  data-testid="social-linkedin"
                >
                  <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-5 bg-gradient-to-br from-background/10 to-background/5 rounded-xl border border-background/10 hover:border-primary/30 transition-all duration-300">
                  <div className="text-2xl font-bold text-primary mb-2">9+</div>
                  <div className="text-background/80 text-sm font-medium">Years Serving</div>
                </div>
                <div className="text-center p-5 bg-gradient-to-br from-background/10 to-background/5 rounded-xl border border-background/10 hover:border-primary/30 transition-all duration-300">
                  <div className="text-2xl font-bold text-primary mb-2">4</div>
                  <div className="text-background/80 text-sm font-medium">Communities</div>
                </div>
              </div>
            </div>
          
            {/* Communities */}
            <div className="lg:col-span-3">
              <div className="flex items-center mb-6">
                <Users className="w-5 h-5 text-primary mr-2" />
                <h3 className="text-xl font-semibold text-background" data-testid="footer-communities-title">
                  Our Communities
                </h3>
              </div>
              <ul className="space-y-3">
                {communities.map((community) => (
                  <li key={community.slug}>
                    <Link 
                      href={`/communities/${community.slug}`} 
                      className="flex items-center text-background/80 hover:text-primary hover:translate-x-2 transition-all duration-300 group"
                      data-testid={`footer-community-${community.slug}`}
                    >
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {community.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          
            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-semibold text-background mb-6" data-testid="footer-quicklinks-title">
                Explore
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="flex items-center text-background/80 hover:text-primary hover:translate-x-2 transition-all duration-300 group"
                      data-testid={`footer-quicklink-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          
            {/* Contact */}
            <div className="lg:col-span-3">
              <h3 className="text-xl font-semibold text-background mb-6" data-testid="footer-contact-title">
                Get In Touch
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start p-4 bg-gradient-to-br from-background/10 to-background/5 rounded-xl hover:from-background/15 hover:to-background/10 transition-all duration-300 border border-background/10 hover:border-primary/30" data-testid="footer-phone">
                  <div className="bg-gradient-to-br from-primary/25 to-primary/20 p-2.5 rounded-xl mr-3 flex-shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-background text-sm font-medium truncate">(970) 444-4689</div>
                    <div className="text-background/60 text-xs">Call us today</div>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-gradient-to-br from-background/10 to-background/5 rounded-xl hover:from-background/15 hover:to-background/10 transition-all duration-300 border border-background/10 hover:border-primary/30" data-testid="footer-email">
                  <div className="bg-gradient-to-br from-primary/25 to-primary/20 p-2.5 rounded-xl mr-3 flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-background text-sm font-medium break-all">info@stagesenior.com</div>
                    <div className="text-background/60 text-xs">Email us anytime</div>
                  </div>
                </div>

                <div className="flex items-start p-4 bg-gradient-to-br from-background/10 to-background/5 rounded-xl hover:from-background/15 hover:to-background/10 transition-all duration-300 border border-background/10 hover:border-primary/30" data-testid="footer-address">
                  <div className="bg-gradient-to-br from-primary/25 to-primary/20 p-2.5 rounded-xl mr-3 flex-shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-background text-sm font-medium">8100 E Arapahoe Road, Suite 208</div>
                    <div className="text-background/60 text-xs">Centennial, CO 80112</div>
                  </div>
                </div>
              </div>
              
              {/* Contact CTA */}
              <div className="mt-6 p-5 bg-gradient-to-br from-secondary/15 to-secondary/10 rounded-xl border border-secondary/20">
                <p className="text-background/95 text-sm mb-4 leading-relaxed">
                  Questions about our communities or services?
                </p>
                <Link href="/contact">
                  <Button
                    variant="secondary"
                    className="bg-background text-foreground hover:bg-background/90 w-full h-12 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                    data-testid="footer-contact-cta"
                  >
                    Contact Us Today
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="bg-gradient-to-b from-foreground to-black/95 border-t border-background/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            
            {/* Copyright and ASHA */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-background/60 text-xs text-center sm:text-left" data-testid="footer-copyright">
                © {new Date().getFullYear()} Stage Management, LLC. All Rights Reserved.
              </div>
              <div className="flex items-center gap-4">
                <span className="text-background/60 text-xs">Proud member of</span>
                <a 
                  href="https://ashaliving.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                  data-testid="footer-asha-link"
                >
                  <img 
                    src={ashaLogoUrl} 
                    alt="ASHA - Assisted Living Association"
                    className="w-auto h-10 sm:h-12"
                    data-testid="footer-asha-logo"
                  />
                </a>
              </div>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-end gap-6 text-sm text-background/60">
              <Link href="/privacy" className="hover:text-primary transition-colors" data-testid="footer-privacy">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary transition-colors" data-testid="footer-terms">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="hover:text-primary transition-colors" data-testid="footer-accessibility">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
