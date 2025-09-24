import { FormEvent, useState } from "react";
import { Link } from "wouter";
import {
  Facebook,
  Linkedin,
  Instagram,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  CalendarDays,
  Sparkles,
  Send
} from "lucide-react";
import logoWhiteUrl from "@assets/stagesenior-logo-wht_1758726884711.webp";
import ashaLogoUrl from "@assets/68af28185bce7fea2a2d6c03_ASHA_ASHA_WHITE_RGB-ezgif.com-resize_1758727665004.webp";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

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

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/stagesenior",
      icon: Facebook,
      testId: "social-facebook"
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/stage-senior-living",
      icon: Linkedin,
      testId: "social-linkedin"
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/stageseniorliving",
      icon: Instagram,
      testId: "social-instagram"
    }
  ];

  const highlightPoints = [
    "Lifestyle & wellness programs shaped by resident interests",
    "Chef-inspired dining with nutrition-forward menus",
    "Dedicated memory care neighborhoods and expert teams"
  ];

  const handleNewsletterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsletterEmail.trim()) {
      setNewsletterSubmitted(false);
      return;
    }

    setNewsletterSubmitted(true);
    setNewsletterEmail("");
  };

  return (
    <footer className="relative overflow-hidden bg-foreground text-background pt-16 pb-12" data-testid="footer">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-40 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-48 left-24 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12">
          <section className="rounded-3xl border border-background/10 bg-background/5 p-8 shadow-2xl shadow-primary/20 backdrop-blur-sm md:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="space-y-4">
                <span
                  className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-background/70"
                  data-testid="footer-cta-eyebrow"
                >
                  <Sparkles className="h-4 w-4" />
                  Discover Stage Senior Living
                </span>
                <h2 className="text-3xl font-bold md:text-4xl" data-testid="footer-cta-title">
                  Ready to plan a visit or learn more?
                </h2>
                <p className="max-w-2xl text-background/80 md:text-lg" data-testid="footer-cta-description">
                  Connect with our team to explore communities, schedule a tour, or ask questions about care options tailored
                  to your family.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
                <Link
                  href="/communities"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition-transform hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  data-testid="footer-cta-communities"
                >
                  <CalendarDays className="h-4 w-4" />
                  Schedule a Tour
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="tel:+13034362300"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-background/30 bg-background/10 px-5 py-3 text-sm font-semibold text-background transition-colors hover:bg-background/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
                  data-testid="footer-cta-phone"
                >
                  <Phone className="h-4 w-4" />
                  (303) 436-2300
                </a>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

            {/* Company Info */}
            <div className="space-y-6">
              <Link
                href="/"
                className="inline-flex w-fit items-center"
                aria-label="Stage Senior Living homepage"
                data-testid="footer-logo"
              >
                <img
                  src={logoWhiteUrl}
                  alt="Stage Senior"
                  className="h-12 w-auto object-contain sm:h-14 md:h-16"
                />
              </Link>
              <p className="text-background/80" data-testid="footer-description">
                Locally owned, resident-focused senior living communities across Colorado since 2016—offering tailored support,
                vibrant programming, and hospitality-driven care.
              </p>
              <ul className="grid gap-2 text-sm text-background/80" data-testid="footer-highlights">
                {highlightPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/30 text-primary-foreground">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-background/30 bg-background/10 text-background/70 transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:text-primary"
                      aria-label={social.name}
                      data-testid={social.testId}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Communities */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-background" data-testid="footer-communities-title">
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
              <h3 className="mb-4 text-lg font-semibold text-background" data-testid="footer-quicklinks-title">
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
            <div className="space-y-5">
              <h3 className="mb-4 text-lg font-semibold text-background" data-testid="footer-contact-title">
                Contact
              </h3>
              <div className="space-y-3 text-background/80">
                <div className="flex items-center" data-testid="footer-phone">
                  <Phone className="mr-2 h-4 w-4" />
                  <span>(303) 436-2300</span>
                </div>
                <div className="flex items-center" data-testid="footer-email">
                  <Mail className="mr-2 h-4 w-4" />
                  <span>info@stagesenior.com</span>
                </div>
                <div className="flex items-start" data-testid="footer-address">
                  <MapPin className="mr-2 mt-1 h-4 w-4" />
                  <span>
                    8100 E Arapahoe Road, Suite 208
                    <br />
                    Centennial, CO 80112
                  </span>
                </div>
              </div>
              <div className="rounded-2xl border border-background/20 bg-background/10 p-5">
                <form className="space-y-3" onSubmit={handleNewsletterSubmit} data-testid="footer-newsletter-form">
                  <div className="space-y-1">
                    <h4 className="text-base font-semibold text-background" data-testid="footer-newsletter-title">
                      Stay in the loop
                    </h4>
                    <p className="text-sm text-background/70" data-testid="footer-newsletter-description">
                      Join our monthly newsletter for community highlights, care resources, and upcoming events.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <label className="sr-only" htmlFor="newsletter-email">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={newsletterEmail}
                      onChange={(event) => {
                        setNewsletterEmail(event.target.value);
                        if (newsletterSubmitted) {
                          setNewsletterSubmitted(false);
                        }
                      }}
                      placeholder="you@example.com"
                      className="h-11 flex-1 rounded-full border border-background/30 bg-background px-4 text-sm text-foreground placeholder:text-foreground/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      data-testid="footer-newsletter-input"
                    />
                    <button
                      type="submit"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/40 transition-transform hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      data-testid="footer-newsletter-submit"
                    >
                      <Send className="h-4 w-4" />
                      Join
                    </button>
                  </div>
                  {newsletterSubmitted && (
                    <p className="text-sm text-background/80" data-testid="footer-newsletter-success" aria-live="polite">
                      Thank you for subscribing! Look for our next update in your inbox.
                    </p>
                  )}
                </form>
              </div>
            </div>

        </div>

        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-background/20 pt-8 md:flex-row md:items-center">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="text-sm text-background/70" data-testid="footer-copyright">
              © {new Date().getFullYear()} Stage Management, LLC. All Rights Reserved.
            </div>
            <a
              href="https://ashaliving.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-transform hover:-translate-y-0.5 hover:opacity-90"
              data-testid="footer-asha-link"
            >
              <img
                src={ashaLogoUrl}
                alt="ASHA Logo"
                className="h-10 w-auto sm:h-12 md:h-14"
                data-testid="footer-asha-logo"
              />
            </a>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-background/70">
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
