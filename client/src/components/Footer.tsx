import { Link } from "wouter";
import { Facebook, Linkedin, Instagram, Phone, Mail, MapPin } from "lucide-react";
import logoWhiteUrl from "@assets/stagesenior-logo-wht_1758726884711.webp";
import ashaLogoUrl from "@assets/68af28185bce7fea2a2d6c03_ASHA_ASHA_WHITE_RGB-ezgif.com-resize_1758727665004.webp";

export default function Footer() {
  const communities = [
    { name: "The Gardens at Columbine", slug: "the-gardens-at-columbine" },
    { name: "The Gardens on Quail", slug: "the-gardens-on-quail" }, 
    { name: "Golden Pond", slug: "golden-pond" },
    { name: "Stonebridge Senior", slug: "stonebridge-senior" }
  ];

  const quickLinks = [
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about-us" },
    { name: "Stage Cares", href: "/stage-cares" },
    { name: "Professional Management Services", href: "/services/management" }
  ];

  return (
    <footer className="bg-foreground text-background py-12" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="mb-4" data-testid="footer-logo">
              <img 
                src={logoWhiteUrl} 
                alt="Stage Senior"
                className="w-auto min-w-[150px] h-12 sm:h-14 md:h-16"
              />
            </div>
            <p className="text-background/80 mb-4" data-testid="footer-description">
              Locally owned, resident-focused senior living communities across Colorado since 2016.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-background/60 hover:text-primary transition-colors"
                data-testid="social-facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-background/60 hover:text-primary transition-colors"
                data-testid="social-linkedin"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-background/60 hover:text-primary transition-colors"
                data-testid="social-instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Communities */}
          <div>
            <h3 className="text-lg font-semibold text-background mb-4" data-testid="footer-communities-title">
              Our Communities
            </h3>
            <ul className="space-y-2 text-background/80">
              {communities.map((community) => (
                <li key={community.slug}>
                  <Link 
                    href={`/communities/${community.slug}`} 
                    className="hover:text-primary transition-colors"
                    data-testid={`footer-community-${community.slug}`}
                  >
                    {community.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-background mb-4" data-testid="footer-quicklinks-title">
              Quick Links
            </h3>
            <ul className="space-y-2 text-background/80">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="hover:text-primary transition-colors"
                    data-testid={`footer-quicklink-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-background mb-4" data-testid="footer-contact-title">
              Contact
            </h3>
            <div className="space-y-2 text-background/80">
              <div className="flex items-center" data-testid="footer-phone">
                <Phone className="w-4 h-4 mr-2" />
                <span>(303) 436-2300</span>
              </div>
              <div className="flex items-center" data-testid="footer-email">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@stagesenior.com</span>
              </div>
              <div className="flex items-start" data-testid="footer-address">
                <MapPin className="w-4 h-4 mr-2 mt-1" />
                <span>8100 E Arapahoe Road, Suite 208<br />Centennial, CO 80112</span>
              </div>
            </div>
          </div>
          
        </div>
        
        <div className="border-t border-background/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-background/60 text-sm" data-testid="footer-copyright">
              © {new Date().getFullYear()} Stage Management, LLC. All Rights Reserved.
            </div>
            <a 
              href="https://ashaliving.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              data-testid="footer-asha-link"
            >
              <img 
                src={ashaLogoUrl} 
                alt="ASHA Logo"
                className="w-auto h-10 sm:h-12 md:h-14"
                data-testid="footer-asha-logo"
              />
            </a>
          </div>
          <div className="flex space-x-6 text-sm text-background/60 mt-4 md:mt-0">
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
    </footer>
  );
}
