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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
          {/* Company Info */}
          <div className="space-y-6" data-testid="footer-company">
            <div className="flex items-center" data-testid="footer-logo">
              <img
                src={logoWhiteUrl}
                alt="Stage Senior"
                className="h-10 w-auto sm:h-12"
              />
            </div>
            <div className="flex items-center space-x-3" data-testid="footer-socials">
              <a
                href="#"
                className="rounded-full border border-background/20 p-2 text-background/60 transition-colors hover:text-primary hover:border-primary/60"
                data-testid="social-facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-full border border-background/20 p-2 text-background/60 transition-colors hover:text-primary hover:border-primary/60"
                data-testid="social-linkedin"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="rounded-full border border-background/20 p-2 text-background/60 transition-colors hover:text-primary hover:border-primary/60"
                data-testid="social-instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Communities */}
          <div className="space-y-4" data-testid="footer-communities">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-background/80" data-testid="footer-communities-title">
              Our Communities
            </h3>
            <ul className="space-y-2 text-sm text-background/70">
              {communities.map((community) => (
                <li key={community.slug}>
                  <Link
                    href={`/communities/${community.slug}`}
                    className="transition-colors hover:text-primary"
                    data-testid={`footer-community-${community.slug}`}
                  >
                    {community.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4" data-testid="footer-quicklinks">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-background/80" data-testid="footer-quicklinks-title">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm text-background/70">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors hover:text-primary"
                    data-testid={`footer-quicklink-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4" data-testid="footer-contact">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-background/80" data-testid="footer-contact-title">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-background/70">
              <div className="flex items-center gap-3" data-testid="footer-phone">
                <Phone className="h-4 w-4" />
                <span>(303) 436-2300</span>
              </div>
              <div className="flex items-center gap-3" data-testid="footer-email">
                <Mail className="h-4 w-4" />
                <span>info@stagesenior.com</span>
              </div>
              <div className="flex items-start gap-3 leading-relaxed" data-testid="footer-address">
                <MapPin className="mt-1 h-4 w-4" />
                <span>8100 E Arapahoe Road, Suite 208<br />Centennial, CO 80112</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-background/15 pt-8 text-sm text-background/60 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 text-center md:flex-row md:items-center md:gap-6 md:text-left">
            <span data-testid="footer-copyright">
              © {new Date().getFullYear()} Stage Management, LLC. All rights reserved.
            </span>
            <a
              href="https://ashaliving.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center transition-opacity hover:opacity-80"
              data-testid="footer-asha-link"
            >
              <img
                src={ashaLogoUrl}
                alt="ASHA Logo"
                className="h-8 w-auto sm:h-10"
                data-testid="footer-asha-logo"
              />
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6" data-testid="footer-legal">
            <Link href="/privacy" className="transition-colors hover:text-primary" data-testid="footer-privacy">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-primary" data-testid="footer-terms">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="transition-colors hover:text-primary" data-testid="footer-accessibility">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
